import ApiFactory from "../../factories/Api.factory"
import ApiHelper from "../../helpers/Api.helper"
import endpoints from '../endpoints.json'

const ApiRequests = {
    async getItemsByCollection(collection) {
        const endpoint = ApiHelper.replaceEndpointParams(endpoints.items.GET.itemsByCollection, { 'collection': collection })
        const datas = await ApiHelper.fetchDatas(`${process.env.REACT_APP_DIRECTUS_URL}${endpoint}`)
        return datas
    },

    async getItemsByCollectionWithFieldsAndFilters(collection, fields, filters) {
        const endpoint = ApiHelper.replaceEndpointParams(
            endpoints.items.GET.itemsByCollectionWithFieldsAndFilters,
            {
                'collection': collection,
                'fields': fields,
                'filters': filters
            }
        )
        const datas = await ApiHelper.fetchDatas(`${process.env.REACT_APP_DIRECTUS_URL}${endpoint}`)
        return datas
    },

    async getMenuPagesIdByMenuName(menuName) {
        const collection = 'menus'
        const fields = 'menu_pages'
        const filters = `filter[menu_name]=${menuName}&filter[status]=published`
        const menuPagesId = await this.getItemsByCollectionWithFieldsAndFilters(collection, fields, filters)
        return menuPagesId.data.length ? menuPagesId.data[0].menu_pages : menuPagesId.data
    },

    async getMenuLinksByPagesId(pagesId) {
        let filterValues = ''
        for (const pageId of pagesId) {
            filterValues += `${pageId},`
        }
        filterValues = filterValues.slice(0, -1)
        const endpoint = ApiHelper.replaceEndpointParams(
            endpoints.items.GET.itemsByRelatedCollectionWith_in,
            {
                'relatedCollection': 'menus_pages',
                'fields': 'pages_id.id, pages_id.page_display_title, pages_id.page_absolute_path',
                'filterCollection': 'pages_id',
                'filterValues': filterValues,
                'sort': 'page_order'
            }
        )
        const datas = await ApiHelper.fetchDatas(`${process.env.REACT_APP_DIRECTUS_URL}${endpoint}`)
        return datas
    },

    async getMenuLinksByMenuName(menuName) {
        const pagesId = await this.getMenuPagesIdByMenuName(menuName)
        const menuLinks = await this.getMenuLinksByPagesId(pagesId)
        return menuLinks
    },

    async getMainMenuLinks() {
        try {
            const mainMenuLinks = await this.getMenuLinksByMenuName('main_menu')
            const datas = mainMenuLinks.data.length ? ApiFactory.linksForHeaderMenu(mainMenuLinks) : mainMenuLinks
            const expiration = new Date().getTime()
            localStorage.setItem('mainMenuLinks', JSON.stringify({ data: datas, error: null, expiration: expiration }))
            return {
                data: datas,
                error: null
            }
        } catch (e) {
            console.error(e)
            return {
                data: null,
                error: 'Erreur lors de la récupération des données'
            }
        }
    },

    async getSkills() {
        try {
            const endpoint = ApiHelper.replaceEndpointParams(endpoints.items.GET.itemsByRelatedCollectionWithout_in, {
                'relatedCollection': 'languages',
                'fields': 'id,language_name,language_svg,color,language_type.id,language_type.language_type_name',
                'filterCollection': 'show_in_skills',
                'filterValues': true,
                'sort': ''
            })
            const datas = await ApiHelper.fetchDatas(`${process.env.REACT_APP_DIRECTUS_URL}${endpoint}`)
            if (datas.error !== null) {
                const expiration = new Date().getTime()
                localStorage.setItem('skills', JSON.stringify({ data: datas.data, error: null, expiration: expiration }))
                return {
                    data: datas.data,
                    error: null
                }
            }
        } catch (error) {
            console.error(error)
            return {
                data: null,
                error: 'Erreur lors de la récupération des données'
            }
        }
    }
}

export default ApiRequests