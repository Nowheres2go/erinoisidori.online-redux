module.exports = function (config) {
    config.addPassthroughCopy("./assets/**")
    config.addPassthroughCopy("./oldworks/**")

    config.addFilter("shortDate", dateObj => {
        if (dateObj === undefined) return dateObj
        return dateObj.toLocaleDateString('en-CA');
    });

    config.addFilter("debug", data => {
        return JSON.stringify(data)
    });

    config.addCollection('works', function (collection) {
        return collection
            .getAll()
            .filter(item => {
                return item.data.tags?.includes('art')
                    || item.data.tags?.includes('posts')
            })
            .sort((a, b) => a.data.date > b.data.date)
    });
}
