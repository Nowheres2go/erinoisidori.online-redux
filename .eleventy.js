module.exports = function(config) {
    config.addPassthroughCopy("./assets/styles/**")
    config.addPassthroughCopy("./assets/svg/**")
    config.addPassthroughCopy("./assets/scripts/**")
}