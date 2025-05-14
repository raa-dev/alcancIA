import type { Plugin } from "@elizaos/core";
import { testAction } from "./actions/testAction";
import { getAddressAction } from "./actions/getAddressAction";
import { walletProvider } from "./providers/wallet";

// Exportar módulos
export * as actions from "./actions/index";
export * as evaluators from "./evaluators/index";
export * as providers from "./providers/index";

// Definir el plugin
export const tokenManagerPlugin: Plugin = {
    name: "token-manager",
    description: "Plugin para gestión de tokens ERC20, ERC721 y ERC1155",
    // Solo registrar las acciones específicas de token/wallet
    actions: [
        getAddressAction
    ],
    // No registrar evaluadores por ahora
    evaluators: [],
    // No registrar providers globales para evitar interferencia con el flujo normal de mensajes
    providers: [
        walletProvider
    ]
}

// Exportar componentes individualmente para uso específico
export * from "./providers/wallet";
export * from "./actions/getAddressAction";

export default tokenManagerPlugin 