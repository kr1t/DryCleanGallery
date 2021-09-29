/* eslint-disable */
import liff from "@line/liff"
import { mapActions, mapGetters, mapMutations } from "vuex"

export default {
  computed: {
    ...mapGetters({
      isLoading: "root/getLoading",
      lineUser: "lineUser/currentUser",
    }),
  },
  methods: {
    ...mapActions({
      loadingStart: "root/loadingStart",
      loadingStop: "root/loadingStop",
      loadUser: "lineUser/loadCurrentUser",
    }),

    async liffInit({ liffId }) {
      if (process.env.NODE_ENV == "development") {
        await this.loadUser({
          userId: "U9000a197796b20586a7695ab8660c789",
          displayName: "Arm.",
          pictureUrl:
            "https://profile.line-scdn.net/0h3gopVtkpbEhSCXqnQuoTH25MYiUlJ2oAKmd2LiNZN3l9aX4bZ2ZzKXIBYCwta3tLOm8hLyAAM3x6",
          email: "a@a.com",
        })

        return
      }
      this.loadingStart()
      await liff.init({
        liffId,
      })

      // if (!liff.isInClient()) {
      //   window.location.href = "https://www.ghbank.co.th/";
      // }

      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile().catch((err) => console.error(err))
        await this.loadUser({
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          email: liff.getDecodedIDToken().email,
        })
      } else {
        liff.login()
      }
      // await this.LineLiffInit(data)
      this.loadingStop()
    },
    closeWindow() {
      liff.closeWindow()
    },
  },
}
