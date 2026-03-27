const METRICS_TTL_SECONDS = 60 * 60 * 24 * 30;

const getRedisConfig = () => {
    const url =
        process.env.STORAGE_KV_REST_API_URL ??
        process.env.KV_REST_API_URL ??
        process.env.UPSTASH_REDIS_REST_URL;
    const readToken =
        process.env.STORAGE_KV_REST_API_READ_ONLY_TOKEN ??
        process.env.KV_REST_API_READ_ONLY_TOKEN;
    const writeToken =
        process.env.STORAGE_KV_REST_API_TOKEN ??
        process.env.KV_REST_API_TOKEN ??
        process.env.UPSTASH_REDIS_REST_TOKEN;

    return {
        url,
        readToken,
        writeToken,
        canRead: Boolean(url && (readToken || writeToken)),
        canWrite: Boolean(url && writeToken),
    };
};

const runRedisCommand = async (
    command: Array<string | number>,
    token: string,
    ): Promise<unknown> => {
        const { url } = getRedisConfig();
    if (!url) return null;

    const response = await fetch(url, {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Redis metric command failed: ${response.status}`);
    }

    const json = (await response.json()) as { result?: unknown };
    return json.result ?? null;
};

export const incrementMetric = async (key: string) => {
    const config = getRedisConfig();
    if (!config.canWrite || !config.writeToken) return;

    try {
        await runRedisCommand(["INCR", key], config.writeToken);
        await runRedisCommand(["EXPIRE", key, METRICS_TTL_SECONDS], config.writeToken);
    } catch {
    }
};

export const getMetricValues = async (keys: string[]) => {
    const config = getRedisConfig();
    if (!config.canRead) {
        return Object.fromEntries(keys.map((key) => [key, 0]));
    }

    const token = config.readToken ?? config.writeToken;
    if (!token) {
        return Object.fromEntries(keys.map((key) => [key, 0]));
    }

    try {
        const result = await runRedisCommand(["MGET", ...keys], token);
        const values = Array.isArray(result) ? result : [];

        return Object.fromEntries(
        keys.map((key, index) => {
            const raw = values[index];
            const value =
            typeof raw === "number"
                ? raw
                : typeof raw === "string"
                ? Number(raw)
                : 0;

            return [key, Number.isFinite(value) ? value : 0];
        }),
        );
    } catch {
        return Object.fromEntries(keys.map((key) => [key, 0]));
    }
};
