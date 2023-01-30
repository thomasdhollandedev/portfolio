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
        const filters = `filter[menu_name]=${menuName}`
        const menuPagesId = await this.getItemsByCollectionWithFieldsAndFilters(collection, fields, filters)
        return menuPagesId.data[0].menu_pages
    },

    async getMenuLinksByPagesId(pagesId) {
        let filterValues = ''
        for (const pageId of pagesId) {
            filterValues += `${pageId},`
        }
        filterValues = filterValues.slice(0, -1)
        const endpoint = ApiHelper.replaceEndpointParams(
            endpoints.items.GET.itemsByRelatedCollection,
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
            const result = ApiFactory.linksForHeaderMenu(mainMenuLinks)
            const expiration = new Date().getTime() + 30 * 24 * 60 * 60 * 1000
            localStorage.setItem('mainMenuLinks', JSON.stringify({data: result, error: null, expiration: expiration}))
            return {
                data: result,
                error: null
            }
        } catch(e) {
            console.error(e)
            return {
                data: null,
                error: 'Erreur lors de la récupération des données'
            }
        }
    }
}

export default ApiRequests