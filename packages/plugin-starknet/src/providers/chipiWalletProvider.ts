import { ChipiSDK, type CreateWalletParams, type CreateWalletResponse } from '@chipi-pay/chipi-sdk'
import { elizaLogger } from '@elizaos/core'

interface ChipiWalletProviderOptions {
  apiPublicKey: string
}

export class ChipiWalletProvider {
  private chipi: ChipiSDK

  constructor(options: ChipiWalletProviderOptions) {
    if (!options.apiPublicKey) throw new Error('API Public Key is required')
    
    this.chipi = new ChipiSDK({
      apiPublicKey: options.apiPublicKey
    })
  }

  async createWallet(params: CreateWalletParams): Promise<CreateWalletResponse> {
    try {
      // Validación básica de parámetros
      if (!params.bearerToken) throw new Error('Bearer token is required')
      if (!params.encryptKey) throw new Error('Encryption key is required')
      
      // Log de parámetros (sin información sensible)
      elizaLogger.log('Iniciando creación de wallet con:', {
        hasBearerToken: !!params.bearerToken,
        hasEncryptKey: !!params.encryptKey,
        apiPublicKey: process.env.CHIPI_API_PUBLIC_KEY ? '[PRESENT]' : '[MISSING]',
        nodeUrl: process.env.STARKNET_RPC_URL ? '[PRESENT]' : '[MISSING]'
      })

      // Crear wallet con parámetros mínimos
      const walletParams: CreateWalletParams = {
        bearerToken: params.bearerToken,
        encryptKey: params.encryptKey,
        apiPublicKey: process.env.CHIPI_API_PUBLIC_KEY!,
        nodeUrl: process.env.STARKNET_RPC_URL || 'https://starknet-mainnet.infura.io/v3/'
      }

      // Intentar crear la wallet
      const response = await this.chipi.createWallet(walletParams)
      
      // Log de respuesta exitosa
      elizaLogger.log('Wallet creada exitosamente:', {
        response: JSON.stringify(response, null, 2)
      })

      return response
    } catch (error: any) {
      // Log detallado del error
      elizaLogger.error('Error al crear wallet:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // Propagar el error original
      throw error
    }
  }
} 