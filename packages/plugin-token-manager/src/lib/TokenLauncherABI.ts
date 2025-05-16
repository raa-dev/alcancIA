export const TokenLauncherABI = [
    {
        inputs: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            { internalType: "uint256", name: "initialSupply", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "allowance", type: "uint256" },
            { internalType: "uint256", name: "needed", type: "uint256" },
        ],
        name: "ERC20InsufficientAllowance",
        type: "error",
    },
    {
        inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "uint256", name: "balance", type: "uint256" },
            { internalType: "uint256", name: "needed", type: "uint256" },
        ],
        name: "ERC20InsufficientBalance",
        type: "error",
    },
    {
        inputs: [
            { internalType: "address", name: "approver", type: "address" },
        ],
        name: "ERC20InvalidApprover",
        type: "error",
    },
    {
        inputs: [
            { internalType: "address", name: "receiver", type: "address" },
        ],
        name: "ERC20InvalidReceiver",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "sender", type: "address" }],
        name: "ERC20InvalidSender",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "spender", type: "address" }],
        name: "ERC20InvalidSpender",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "OwnableInvalidOwner",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "OwnableUnauthorizedAccount",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

export const TokenLauncherBytecode = "0x608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c57806395d89b411161006657806395d89b4114610239578063a9059cbb14610257578063dd62ed3e14610287578063f2fde38b146102b7576100ea565b806370a08231146101e1578063715018a6146102115780638da5cb5b1461021b576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b57806340c10f19146101a957806342966c68146101c5576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f76102d3565b6040516101049190610eb5565b60405180910390f35b61012760048036038101906101229190610f70565b610365565b6040516101349190610fcb565b60405180910390f35b610145610388565b6040516101529190610ff5565b60405180910390f35b61017560048036038101906101709190611010565b610392565b6040516101829190610fcb565b60405180910390f35b6101936103c1565b6040516101a0919061107f565b60405180910390f35b6101c360048036038101906101be9190610f70565b6103ca565b005b6101df60048036038101906101da919061109a565b6103e0565b005b6101fb60048036038101906101f691906110c7565b6103ed565b6040516102089190610ff5565b60405180910390f35b610219610435565b005b610223610449565b6040516102309190611103565b60405180910390f35b610241610473565b60405161024e9190610eb5565b60405180910390f35b610271600480360381019061026c9190610f70565b610505565b60405161027e9190610fcb565b60405180910390f35b6102a1600480360381019061029c919061111e565b610528565b6040516102ae9190610ff5565b60405180910390f35b6102d160048036038101906102cc91906110c7565b6105af565b005b6060600380546102e29061118d565b80601f016020809104026020016040519081016040528092919081815260200182805461030e9061118d565b801561035b5780601f106103305761010080835404028352916020019161035b565b820191906000526020600020905b81548152906001019060200180831161033e57829003601f168201915b5050505050905090565b600080610370610635565b905061037d81858561063d565b600191505092915050565b6000600254905090565b60008061039d610635565b90506103aa85828561064f565b6103b58585856106e4565b60019150509392505050565b60006012905090565b6103d26107d8565b6103dc828261085f565b5050565b6103ea33826108e1565b50565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b61043d6107d8565b6104476000610963565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104829061118d565b80601f01602080910402602001604051908101604052809291908181526020018280546104ae9061118d565b80156104fb5780601f106104d0576101008083540402835291602001916104fb565b820191906000526020600020905b8154815290600101906020018083116104de57829003601f168201915b5050505050905090565b600080610510610635565b905061051d8185856106e4565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6105b76107d8565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036106295760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016106209190611103565b60405180910390fd5b61063281610963565b50565b600033905090565b61064a8383836001610a29565b505050565b600061065b8484610528565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156106de57818110156106ce578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016106c5939291906111be565b60405180910390fd5b6106dd84848484036000610a29565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107565760006040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161074d9190611103565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107c85760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016107bf9190611103565b60405180910390fd5b6107d3838383610c00565b505050565b6107e0610635565b73ffffffffffffffffffffffffffffffffffffffff166107fe610449565b73ffffffffffffffffffffffffffffffffffffffff161461085d57610821610635565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016108549190611103565b60405180910390fd5b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108d15760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108c89190611103565b60405180910390fd5b6108dd60008383610c00565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036109535760006040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161094a9190611103565b60405180910390fd5b61095f82600083610c00565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610a9b5760006040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610a929190611103565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b0d5760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610b049190611103565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610bfa578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610bf19190610ff5565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610c52578060026000828254610c469190611224565b92505081905550610d25565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610cde578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610cd5939291906111be565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d6e5780600260008282540392505081905550610dbb565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e189190610ff5565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610e5f578082015181840152602081019050610e44565b60008484015250505050565b6000601f19601f8301169050919050565b6000610e8782610e25565b610e918185610e30565b9350610ea1818560208601610e41565b610eaa81610e6b565b840191505092915050565b60006020820190508181036000830152610ecf8184610e7c565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610f0782610edc565b9050919050565b610f1781610efc565b8114610f2257600080fd5b50565b600081359050610f3481610f0e565b92915050565b6000819050919050565b610f4d81610f3a565b8114610f5857600080fd5b50565b600081359050610f6a81610f44565b92915050565b60008060408385031215610f8757610f86610ed7565b5b6000610f9585828601610f25565b9250506020610fa685828601610f5b565b9150509250929050565b60008115159050919050565b610fc581610fb0565b82525050565b6000602082019050610fe06000830184610fbc565b92915050565b610fef81610f3a565b82525050565b600060208201905061100a6000830184610fe6565b92915050565b60008060006060848603121561102957611028610ed7565b5b600061103786828701610f25565b935050602061104886828701610f25565b925050604061105986828701610f5b565b9150509250925092565b600060ff82169050919050565b61107981611063565b82525050565b60006020820190506110946000830184611070565b92915050565b6000602082840312156110b0576110af610ed7565b5b60006110be84828501610f5b565b91505092915050565b6000602082840312156110dd576110dc610ed7565b5b60006110eb84828501610f25565b91505092915050565b6110fd81610efc565b82525050565b600060208201905061111860008301846110f4565b92915050565b6000806040838503121561113557611134610ed7565b5b600061114385828601610f25565b925050602061115485828601610f25565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806111a557607f821691505b6020821081036111b8576111b761115e565b5b50919050565b60006060820190506111d360008301866110f4565b6111e06020830185610fe6565b6111ed6040830184610fe6565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061122f82610f3a565b915061123a83610f3a565b9250828201905080821115611252576112516111f5565b5b9291505056fea2646970667358221220b41fa92b49442b386303d707283057563e9b8f20dd8e52adf9dc06dd0f437c4c64736f6c63430008140033";