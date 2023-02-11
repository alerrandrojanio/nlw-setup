import WebPush from "web-push"
import { FastifyInstance } from "fastify"
import { z } from "zod"

const publicKey =
  "BLNbUudEYOBCzp9Z3ueswqaVIpDkMXP7NYZHOnca8OFXmivxAoS7IxcR2jriINhyyZy0mbd9UdoYcWG11JDGfX8"
const privateKey = "yBmVNsae1M1Md5F5PPGjb7y0srYU6BHG9_2L0MsGXBs"

WebPush.setVapidDetails("http://localhost/3333", publicKey, privateKey)

export async function notificationRoutes(app: FastifyInstance) {
  app.get("/push/public_key", () => {
    return {
      publicKey,
    }
  })

  app.post("/push/register", (request, response) => {
    console.log(request.body)

    return response.status(201).send()
  })

  app.post("/push/send", async (request, response) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    })

    const { subscription } = sendPushBody.parse(request.body)

    setTimeout(() => {
      WebPush.sendNotification(subscription, "Hello do Backend!")
    }, 5000)

    return response.status(201).send()
  })
}
