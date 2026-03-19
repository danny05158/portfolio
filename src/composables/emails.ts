import emailjs from "@emailjs/browser"
import {useUtils} from "/src/composables/utils"

const _params: { publicKey: string | null; serviceId: string | null; templateId: string | null } = {
    publicKey: null,
    serviceId: null,
    templateId: null
}

const utils = useUtils()

export const useEmails = () => {
    const init = (publicKey: string, serviceId: string, templateId: string): void => {
        _params.publicKey = publicKey
        _params.serviceId = serviceId
        _params.templateId = templateId

        if(!publicKey || !serviceId || !templateId)
            throw new Error("Error initializing emails.js! Make sure you informed all parameters correctly.")

        emailjs.init(_params.publicKey)
    }

    const sendContact = async (fromName: string, fromEmail: string, customSubject: string, message: string): Promise<boolean> => {
        if(!_params.serviceId || !_params.templateId)
            throw new Error("EmailJS hasn't been initialized!")

        const requestParams = {
            name: fromName,
            from_name: fromName,
            email: fromEmail,
            from_email: fromEmail,
            custom_subject: customSubject,
            custom_source: utils.getAbsoluteLocation(),
            custom_source_name: "Vue Resume",
            message: message
        }

        try {
            await emailjs.send(
                _params.serviceId,
                _params.templateId,
                requestParams
            )
            return true
        } catch (_error) {
            return false
        }
    }

    return {
        init,
        sendContact
    }
}
