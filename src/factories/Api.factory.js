const ApiFactory = {
    linksForHeaderMenu(objs) {
        try {
            const newDatas = []
    
            for (const obj of objs.data) {
                newDatas.push(obj.pages_id)
            }

            return {
                data: newDatas,
                error: null
            }
        } catch(e) {
            console.error(e)
            return {
                data: null,
                error: "Erreur lors de la récupération des données"
            }
        }
    }
}

export default ApiFactory