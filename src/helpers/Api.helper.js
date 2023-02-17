const ApiHelper = {
    replaceEndpointParams(endpoint, params) {
        for (const [key, value] of Object.entries(params)) {
            endpoint = endpoint.replace(`:${key}`, `${value}`)
        }
        return endpoint
    },

    async fetchDatas(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_DIRECTUS_TOKEN}`
                }
            })
            const datas = await response.json()
    
            return {
                data: datas.data,
                error: null
            }
        } catch (error) {
            console.error(error)
            return {
                data: null,
                error: "Erreur lors de la récupération des données"
            }
        }
    }
}

export default ApiHelper