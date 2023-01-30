const ApiFactory = {
    linksForHeaderMenu(objs) {
        try {
            const newDatas = []
    
            for (const obj of objs.data) {
                newDatas.push(obj.pages_id)
            }

            return newDatas
        } catch(e) {
            console.error(e)
        }
    }
}

export default ApiFactory