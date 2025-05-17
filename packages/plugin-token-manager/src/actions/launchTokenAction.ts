import { type ByteArray, parseEther, type Hex } from "viem"
import {
    type Action,
    composeContext,
    generateObjectDeprecated,
    type HandlerCallback,
    ModelClass,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger
} from "@elizaos/core"

import { initWalletProvider, type WalletProvider } from "../providers/wallet"
import { TokenLauncherABI } from "../lib/TokenLauncherABI"
import { encodeFunctionData, parseAbi, encodeAbiParameters } from "viem"
import type { SupportedChain } from "../types"

interface LaunchTokenParams {
    chain: SupportedChain
    name: string
    symbol: string
    initialSupply: string
}

interface Transaction {
    hash: `0x${string}`
    from: `0x${string}`
    to: `0x${string}`
    value: bigint
    data: Hex
    contractAddress?: `0x${string}`
}

const launchTokenTemplate = `
You are an AI assistant that helps users launch new ERC20 tokens.
You MUST respond with a valid JSON object containing the following fields:
- chain: The blockchain network where the token will be deployed (e.g., "arbitrumSepolia", "base", "sepolia")
- name: The full name of the token
- symbol: The token symbol (usually 3-4 characters)
- initialSupply: The initial supply of tokens to mint (in token units, not wei)

Example response format:
{
    "chain": "arbitrumSepolia",
    "name": "My Token",
    "symbol": "MTK",
    "initialSupply": "1000000"
}

IMPORTANT: 
1. Your response MUST be a valid JSON object, nothing else.
2. Do not include any text before or after the JSON.
3. Use one of these supported chains: arbitrumSepolia, base, sepolia, or hardhat.
4. The initialSupply should be a string representing the number of tokens (not wei).
`

export class LaunchTokenAction {
    constructor(private walletProvider: WalletProvider) {}

    async launchToken(params: LaunchTokenParams): Promise<Transaction> {
        elizaLogger.log(
            `Launching token: ${params.name} (${params.symbol}) with initial supply ${params.initialSupply} on ${params.chain}`
        )

        this.walletProvider.switchChain(params.chain)
        const walletClient = this.walletProvider.getWalletClient(params.chain)
        const publicClient = this.walletProvider.getPublicClient(params.chain)

        // Verificar el balance antes de intentar desplegar
        const balance = await this.walletProvider.getWalletBalanceForChain(params.chain)
        if (!balance || parseFloat(balance) < 0.01) {
            throw new Error(`Insufficient funds on ${params.chain}. Current balance: ${balance} ETH. You need at least 0.01 ETH to deploy the token.`)
        }

        try {
            // Codificar los argumentos del constructor
            const constructorArgs = encodeAbiParameters(
                [
                    { name: "name", type: "string" },
                    { name: "symbol", type: "string" },
                    { name: "initialSupply", type: "uint256" }
                ],
                [params.name, params.symbol, parseEther(params.initialSupply)]
            )

            // Combinar el bytecode con los argumentos del constructor
            // Asegurarnos de que el bytecode no tenga 0x duplicado
            //const bytecode = TokenLauncherBytecode.startsWith('0x') ? TokenLauncherBytecode.slice(2) : TokenLauncherBytecode
            //const deployData = `0x${bytecode}${constructorArgs.slice(2)}` as Hex
            const deployData = `0x${constructorArgs.slice(2)}` as Hex

            const hash = await walletClient.sendTransaction({
                account: walletClient.account,
                data: deployData,
                value: 0n,
                kzg: undefined,
                chain: undefined
            })

            // Esperar a que la transacción sea minada y obtener el recibo
            let receipt
            while (!receipt) {
                try {
                    receipt = await publicClient.getTransactionReceipt({ hash })
                    if (!receipt) {
                        await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar 1 segundo
                    }
                } catch (error) {
                    await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar 1 segundo
                }
            }
            
            if (!receipt.contractAddress) {
                throw new Error("No se pudo obtener la dirección del contrato desplegado")
            }

            return {
                hash,
                from: walletClient.account.address,
                to: "0x0000000000000000000000000000000000000000" as `0x${string}`, // Contract creation
                value: 0n,
                data: deployData,
                contractAddress: receipt.contractAddress as `0x${string}`
            }
        } catch (error) {
            throw new Error(`Token launch failed: ${error.message}`)
        }
    }
}

const buildLaunchTokenDetails = async (
    state: State,
    runtime: IAgentRuntime,
    wp: WalletProvider
): Promise<LaunchTokenParams> => {
    const chains = Object.keys(wp.chains)
    state.supportedChains = chains.map((item) => `"${item}"`).join("|")

    const context = composeContext({
        state,
        template: launchTokenTemplate
    })

    const launchDetails = (await generateObjectDeprecated({
        runtime,
        context,
        modelClass: ModelClass.SMALL
    })) as LaunchTokenParams

    const existingChain = wp.chains[launchDetails.chain]

    if (!existingChain) {
        throw new Error(
            "The chain " +
                launchDetails.chain +
                " not configured yet. Add the chain or choose one from configured: " +
                chains.toString()
        )
    }

    return launchDetails
}

export const launchTokenAction: Action = {
    name: "launch_token",
    description: "Launch a new ERC20 token on the specified blockchain",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback?: HandlerCallback
    ) => {
        if (!state) {
            state = (await runtime.composeState(message)) as State
        } else {
            state = await runtime.updateRecentMessageState(state)
        }

        elizaLogger.log("Launch token action handler called")
        const walletProvider = await initWalletProvider(runtime)
        const action = new LaunchTokenAction(walletProvider)

        const paramOptions = await buildLaunchTokenDetails(
            state,
            runtime,
            walletProvider
        )

        try {
            const launchResp = await action.launchToken(paramOptions)
            if (callback) {
                callback({
                    text: `Successfully launched token ${paramOptions.name} (${paramOptions.symbol}) with initial supply ${paramOptions.initialSupply}\nTransaction Hash: ${launchResp.hash}\nContract Address: ${launchResp.contractAddress}`,
                    content: {
                        success: true,
                        hash: launchResp.hash,
                        contractAddress: launchResp.contractAddress,
                        name: paramOptions.name,
                        symbol: paramOptions.symbol,
                        initialSupply: paramOptions.initialSupply,
                        chain: paramOptions.chain
                    }
                })
            }
            return true
        } catch (error) {
            elizaLogger.error("Error during token launch:", error)
            if (callback) {
                callback({
                    text: `Error launching token: ${error.message}`,
                    content: { error: error.message }
                })
            }
            return false
        }
    },
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY")
        return typeof privateKey === "string" && privateKey.startsWith("0x")
    },
    examples: [
        [
            {
                user: "assistant",
                content: {
                    text: "I'll help you launch a new token called 'My Token' with symbol 'MTK' and initial supply of 1,000,000 tokens on Arbitrum Sepolia",
                    action: "LAUNCH_TOKEN"
                }
            },
            {
                user: "user",
                content: {
                    text: "Launch a new token called 'My Token' with symbol 'MTK' and initial supply of 1,000,000 tokens on Arbitrum Sepolia",
                    action: "LAUNCH_TOKEN"
                }
            }
        ]
    ],
    similes: ["CREATE_TOKEN", "DEPLOY_TOKEN", "NEW_TOKEN"]
}
