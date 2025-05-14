import { Action, ActionExample, Content, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core"

export const testAction: Action = {
    name: "TEST_ACTION_CALL",
    similes: ["TEST", "PRUEBA"],
    description: "Acción de prueba para verificar el funcionamiento del plugin",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validación simple: siempre retorna true
        return true
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: unknown,
        callback: HandlerCallback
    ) => {
        // Crear una respuesta simple
        const response: Content = {
            text: "Esta es una respuesta de prueba del plugin",
            action: "TEST_ACTION_CALL",
            // Agregamos esta bandera para indicar que el modelo no debe generar una respuesta adicional
            skipModelResponse: true
        }

        // Registrar la acción
        runtime.databaseAdapter.log({
            body: { message, response },
            userId: message.userId,
            roomId: message.roomId,
            type: "test_action"
        })

        // Ejecutar el callback con la respuesta
        await callback(response)
        return response
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "¿Puedes probar la acción de test?",
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Esta es una respuesta de prueba del plugin",
                    action: "TEST_ACTION_CALL"
                }
            }
        ]
    ] as ActionExample[][]
}
