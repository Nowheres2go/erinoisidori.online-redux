module.exports = function(config) {
    config.addPassthroughCopy("./assets/**")
    config.addPassthroughCopy("./oldworks/**")


    config.addFilter("shortDate", dateObj => {
        return dateObj.toLocaleDateString('en-CA');
    });}
