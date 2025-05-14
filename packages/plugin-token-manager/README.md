# Plugin Token Manager

Plugin para ElizaOS que proporciona funcionalidades de gestión de tokens ERC20, ERC721 y ERC1155.

## Características

- Transferencia de tokens
- Minting de tokens
- Burning de tokens
- Aprobación de tokens
- Consulta de balances
- Gestión de metadatos

## Instalación

```bash
pnpm add @elizaos/plugin-token-manager
```

## Configuración

Agregar el plugin a tu archivo de configuración:

```json
{
  "plugins": ["token-manager"]
}
```

## Uso

El plugin proporciona las siguientes funcionalidades:

### Acciones
- `transferToken`: Transferir tokens a otra dirección
- `mintToken`: Crear nuevos tokens
- `burnToken`: Quemar tokens existentes
- `approveToken`: Aprobar tokens para ser gastados por otra dirección

### Evaluadores
- `tokenBalance`: Evaluar el balance de tokens
- `tokenApproval`: Evaluar las aprobaciones de tokens

### Providers
- `tokenInfo`: Obtener información básica del token
- `tokenMetadata`: Obtener metadatos del token

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build
pnpm build

# Tests
pnpm test
```

## Licencia

MIT 