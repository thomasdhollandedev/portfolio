import ApiFactory from "../../factories/Api.factory"
import ApiHelper from "../../helpers/Api.helper"
import endpoints from '../endpoints.json'

const ApiRequests = {
    async getItemsByCollection(collection) {
        try {
            const endpoint = ApiHelper.replaceEndpointParams(endpoints.items.GET.itemsByCollection, { 'collection': collection })
            const datas = await ApiHelper.fetchDatas(`${process.env.REACT_APP_DIRECTUS_URL}${endpoint}`)

            return {
                data: datas.data,
                error: null
            }
        } catch (error) {
            return {
                data: null,
                error: 'Erreur lors de la récupération des données'
            }
        }
    },

    async getItemsByCollectionWithFieldsAndFilters(collection, fields, filters) {
        try {
            const endpoint = ApiHelper.replaceEndpointParams(
                endpoints.items.GET.itemsByCollectionWithFieldsAndFilters,
                {
                    'collection': collection,
                    'fields': fields,
                    'filters': filters
                }
            )
            const datas = await ApiHelper.fetchDatas(`${process.env.REACT_APP_DIRECTUS_URL}${endpoint}`)

            if (datas.error !== null) {
                return {
                    data: null,
                    error: "Erreur lors de la récupération des données"
                }
            }

            return {
                data: datas.data,
                error: null
            }
        } catch (error) {
            return {
                data: null,
                error: "Erreur lors de la récupération des données"
            }
        }
    },

    async getMenuPagesIdByMenuName(menuName) {
        try {
            const collection = 'menus'
            const fields = 'menu_pages'
            const filters = `filter[menu_name]=${menuName}&filter[status]=published`
            const menuPagesId = await this.getItemsByCollectionWithFieldsAndFilters(collection, fields, filters)

            return {
                data: menuPagesId.data.length ? menuPagesId.data[0].menu_pages : menuPagesId.data,
                error: null
            }
        } catch (error) {
            return {
                data: null,
                error: "Erreur lors de la récupération des données"
            }
        }
    },

    async getMenuLinksByPagesId(pagesId) {
        try {
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
            return {
                data: datas.data,
                error: null
            }
        } catch (error) {
            return {
                data: null,
                error: "Erreur lors de la récupération des données"
            }
        }
    },

    async getMenuLinksByMenuName(menuName) {
        try {
            const pagesId = await this.getMenuPagesIdByMenuName(menuName)

            if (pagesId.error !== null) {
                return {
                    data: null,
                    error: "Erreur lors de la récupération des données"
                }
            }

            const menuLinks = await this.getMenuLinksByPagesId(pagesId.data)

            if (menuLinks.error !== null) {
                return {
                    data: null,
                    error: "Erreur lors de la récupération des données"
                }
            }

            return {
                data: menuLinks.data,
                error: null
            }
        } catch (error) {
            return {
                data: null,
                error: "Erreur lors de la récupération des données"
            }
        }
    },

    async getMainMenuLinks() {
        try {
            const mainMenuLinks = await this.getMenuLinksByMenuName('main_menu')
            
            if (mainMenuLinks.error !== null) {
                return {
                    data: null,
                    error: "Erreur lors de la récupération des données"
                }
            }

            const datas = mainMenuLinks.data.length ? ApiFactory.linksForHeaderMenu(mainMenuLinks) : mainMenuLinks

            if (datas.error !== null) {
                return {
                    data: null,
                    error: 'Erreur lors de la récupération des données'
                }
            }


            const expiration = new Date().getTime()
            localStorage.setItem('mainMenuLinks', JSON.stringify({ data: datas, error: null, expiration: expiration }))
            return {
                data: datas.data,
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
                return {
                    data: null,
                    error: "Erreur lors de la récupération des données"
                }
            }

            const expiration = new Date().getTime()
            localStorage.setItem('skills', JSON.stringify({ data: datas.data, error: null, expiration: expiration }))
            return {
                data: datas.data,
                error: null
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