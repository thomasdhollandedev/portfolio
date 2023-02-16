import moment from 'moment'

const FeaturesHelper = {
    needCacheUpdate(cache_last_update) {
        let last_update = moment(process.env.REACT_APP_LAST_UPDATE, "DD/MM/YYYY HH:mm")
        last_update = last_update.valueOf()
        return last_update >= cache_last_update
      }
}

export default FeaturesHelper