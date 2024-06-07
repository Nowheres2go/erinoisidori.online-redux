module.exports = function(config) {
    config.addPassthroughCopy("./assets/**")
    config.addPassthroughCopy("./oldworks/**")


    config.addFilter("shortDate", dateObj => {
        if (dateObj === undefined) return dateObj
        return dateObj.toLocaleDateString('en-CA');
    });

    config.addFilter("debug", data => {
        return JSON.stringify(data)
    })
}
