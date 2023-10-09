import mixpanel from 'mixpanel-browser';

export default {
    install: (app: any, { config = {}, token }: { config: object; token: string;}) => {
        const defaultConfig = {}
        const endConfig = Object.assign(config, defaultConfig)

        mixpanel.init(token, endConfig)
        app.provide('mixpanel', mixpanel)
    }
}