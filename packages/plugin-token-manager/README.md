# Plugin Token Manager

Plugin para ElizaOS que proporciona funcionalidades de gestión de tokens ERC20 y sistema de votación para condominios.

## Características

### Gestión de Tokens
- Distribución de tokens de votación
- Consulta de balances
- Transferencia de tokens
- Aprobación de tokens

### Sistema de Votación
- Distribución de tokens a vecinos
- Creación de propuestas
- Votación en propuestas
- Consulta de resultados
- Cierre de propuestas

## Instalación

```bash
pnpm add @elizaos/plugin-token-manager
```

## Configuración

Agregar el plugin a tu archivo de configuración:

```json
{
  "plugins": ["plugin-token-manager"],
  "settings": {
    "chains": {
      "evm": ["arbitrumSepolia"]
    }
  }
}
```

### Variables de Entorno Requeridas
```env
ETHEREUM_PROVIDER_ARBITRUMSEPOLIA=https://arb-sepolia.g.alchemy.com/v2/tu-api-key
EVM_PRIVATE_KEY=tu-clave-privada
```

## Uso

### Acciones de Tokens
- `distributeTokens`: Distribuir tokens de votación a vecinos
- `getTokenInfo`: Consultar información del token (balance, total supply, etc.)

### Acciones de Votación (Próximamente)
- `createProposal`: Crear una nueva propuesta para votación
- `vote`: Emitir un voto en una propuesta
- `getProposal`: Consultar el estado de una propuesta
- `closeProposal`: Cerrar una propuesta activa

### Ejemplos de Uso

#### Distribuir Tokens
```
Donna, distribuye tokens de votación a estos vecinos:
Casa 12: 0x09471f22B1033b8f9b1922Ee67313EFB7B5359E2
```

#### Consultar Balance
```
Donna, ¿cuál es el balance de tokens de la Casa 12?
```

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

## Redes Soportadas
- Arbitrum Sepolia (Testnet)

## Licencia

MIT 