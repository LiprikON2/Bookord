import { useQuery } from "@tanstack/react-query";
import { useSettingsStore } from "../stores";
import context from "../ipc/thirdPartyApi";

const yandexOauthTokenSettingKeyList = ["General", "API", "AI", "Yandex Cloud Oauth Token"];

export const useYandexCloudIamAuth = () => {
    const { getSetting } = useSettingsStore();

    const yandexOauthToken = getSetting(yandexOauthTokenSettingKeyList).value;

    const { data: iamToken, error: iamTokenError } = useQuery({
        queryKey: ["yandexGpt", yandexOauthToken] as [string, string],
        queryFn: ({ queryKey: [_, yandexOauthToken] }) => {
            return context.apiYandexCloudIamAuth(yandexOauthToken);
        },
        staleTime: 12 * 60 * 60 * 1000,
        retry: false,
        enabled: Boolean(yandexOauthToken),
    });

    return { yandexOauthToken, iamToken, iamTokenError };
};
