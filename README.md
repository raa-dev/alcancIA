# alcancIA

Un agente de inteligencia artificial que simplifica el acceso al ahorro descentralizado. Los usuarios pueden crear billeteras Web3 invisibles, establecer metas de ahorro personalizadas y formar grupos de ahorro con amigos.

---

## Objetivo

Facilitar el acceso al ahorro descentralizado mediante un agente inteligente. Los usuarios pueden:
- Crear wallets Web3 invisibles (Account Abstraction)
- Definir metas de ahorro personalizadas
- Formar grupos de ahorro con amigos
- Seguir el progreso y recibir incentivos por ahorrar

---

## Prerequisitos

- Node.js 23+ (se recomienda usar nvm)
- pnpm 9+
- Git para control de versiones
- Un editor de código (VS Code, Cursor o VSCodium recomendado)

---

## Instalación y despliegue

1. Clona el repositorio:
   ```bash
   git clone https://github.com/robz323/alcancIA
   cd alcancIA
   cp .env.example .env
   pnpm install
   pnpm build
   ```

2. Inicia el personaje Don Jaimito:
   ```bash
   pnpm start --character="./characters/jaimito.character.json"
   pnpm start:client
   ```

---

## Descripción del proyecto

alcancIA es un agente conversacional que ayuda a los usuarios a crear estrategias de ahorro, gestionar wallets en Starknet y participar en grupos de ahorro. El agente guía al usuario de forma empática y sencilla, integrando tecnologías de Account Abstraction y social login para una experiencia Web3 sin fricción.

- **Wallet invisible:** Crea y gestiona wallets sin exponer llaves privadas.
- **Metas de ahorro:** Define y sigue objetivos personalizados.
- **Grupos de ahorro:** Crea grupos, establece metas colectivas y distribuye incentivos.
- **Dashboard:** Visualiza el progreso y el historial de ahorro.

---

## Contribución

1. Haz fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Haz commit y push de tus cambios.
4. Abre un Pull Request.

---

## Licencia

MIT