interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendViaLambda(payload: EmailPayload): Promise<boolean> {
  const functionUrl = process.env.LAMBDA_FUNCTION_URL;
  const functionName = process.env.LAMBDA_FUNCTION_NAME;

  // Try HTTP Function URL first (simpler, no AWS creds needed)
  if (functionUrl) {
    try {
      const resp = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: payload.to,
          subject: payload.subject,
          body: payload.html,
        }),
      });
      return resp.ok;
    } catch (err) {
      console.error("Erro ao chamar Lambda Function URL:", err);
      // fallthrough to try SDK if available
    }
  }

  // If no Function URL, try invoking Lambda via AWS SDK (requires AWS creds + permission)
  if (functionName) {
    try {
      // dynamic import so project can still run if dependency not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { LambdaClient, InvokeCommand } =
        await import("@aws-sdk/client-lambda");
      const client = new LambdaClient({
        region: process.env.AWS_REGION || "us-east-1",
      });
      const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: Buffer.from(
          JSON.stringify({
            to: payload.to,
            subject: payload.subject,
            body: payload.html,
          }),
        ),
      });
      const result = await client.send(command);
      if (
        result.StatusCode &&
        result.StatusCode >= 200 &&
        result.StatusCode < 300
      )
        return true;
      console.error("Lambda invoke returned non-2xx:", result);
      return false;
    } catch (err) {
      console.error("Erro ao invocar Lambda via SDK:", err);
      return false;
    }
  }

  console.error(
    "Nenhuma forma de invocar Lambda configurada (LAMBDA_FUNCTION_URL ou LAMBDA_FUNCTION_NAME)",
  );
  return false;
}
