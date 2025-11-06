module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Tarayıcı uyumluluğu için daha geniş destek
      overrideBrowserslist: [
        "> 1%",
        "last 2 versions",
        "Firefox ESR",
        "not dead",
        "not IE 11"
      ],
      // Vendor prefix'leri zorla ekle
      add: true,
      // Grid layout desteği
      grid: "autoplace",
      // Flexbox desteği
      flexbox: "no-2009"
    },
    // CSS optimizasyonu ve tarayıcı uyumluluğu
    'postcss-normalize': {},
    // Renk fonksiyonları için ek destek
    'postcss-color-function': {},
  },
}
