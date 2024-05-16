<template>
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css" rel="stylesheet">
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" right bottom>
    {{ snackbarText }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <!-- 新增的 v-dialog -->
  <v-dialog v-model="isModal" max-width="600px">
    <template v-slot:default>
      <v-card>
        <!-- 組件內容 -->
        <v-card-title>
          <v-btn icon class="entry-detail__close-btn" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <!-- 網站名稱欄位 -->
            <v-text-field label="網站名稱" v-model="localEntry.website" :rules="requiredRules" required append-inner-icon="mdi-content-copy" @click:append-inner="copyText(localEntry.website)"></v-text-field>


            <!-- 使用者名稱欄位 -->
            <v-text-field label="使用者名稱" v-model="localEntry.username" :rules="requiredRules" required append-inner-icon="mdi-content-copy" @click:append-inner="copyText(localEntry.username)"></v-text-field>

            <!-- 密碼欄位 -->
            <v-text-field :type="passwordFieldType" label="密碼" v-model="localEntry.password" :rules="requiredRules" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" append-inner-icon="mdi-content-copy" @click:append="togglePasswordVisibility" @click:append-inner="copyText(localEntry.password)" @input="updatePasswordStrength" required></v-text-field>

            <!-- 密碼強度 -->
            <v-slider v-model="strength" :label="strengthLabel" :color="strengthColor" :track-color="trackColor" min="0" max="100" readonly></v-slider> <!-- Checkboxes for Password Criteria -->

            <!-- 登入頁面網址 -->
            <v-text-field label="登入頁面網址" v-model="localEntry.uri" :rules="urlRules" required append-inner-icon="mdi-content-copy" @click:append-inner="copyText(localEntry.uri)"></v-text-field>

            <v-btn :disabled="!valid" @click="saveentry">儲存</v-btn>
            <v-divider class="my-4"></v-divider>
            <password-generator />
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
  <transition name="slide-fade">
    <v-container v-if="showDetail">
      <v-btn icon class="entry-detail__close-btn" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-form ref="form" v-model="valid">
        <!-- 網站名稱欄位 -->
        <v-text-field label="網站名稱" v-model="localEntry.website" :rules="requiredRules" required append-inner-icon="mdi-content-copy" @click:append-inner="copyText(localEntry.website)"></v-text-field>

        <!-- 使用者名稱欄位 -->
        <v-text-field label="使用者名稱" v-model="localEntry.username" :rules="requiredRules" required append-inner-icon="mdi-content-copy" @click:append-inner="copyText(localEntry.username)"></v-text-field>

        <!-- 密碼欄位 -->
        <v-text-field :type="passwordFieldType" label="密碼" v-model="localEntry.password" :rules="requiredRules" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="togglePasswordVisibility" required append-inner-icon="mdi-content-copy" @click:append-inner="copyText(localEntry.password)" @input="updatePasswordStrength"></v-text-field>

        <!-- 密碼強度 -->
        <v-slider v-model="strength" :label="strengthLabel" :color="strengthColor" :track-color="trackColor" min="0" max="100" readonly></v-slider> <!-- Checkboxes for Password Criteria -->

        <!-- 登入頁面網址 -->
        <v-text-field label="登入頁面網址" v-model="localEntry.uri" :rules="urlRules" required append-inner-icon="mdi-content-copy" @click:append-inner="copyText(localEntry.uri)"></v-text-field>

        <v-btn :disabled="!valid" @click="saveentry">儲存</v-btn>
        <v-divider class="my-4"></v-divider>
        <password-generator />
      </v-form>
    </v-container>
  </transition>
</template>

<script>
  import '@mdi/font/css/materialdesignicons.min.css';
  import PasswordGenerator from '@/components/PasswordGenerator.vue'; // Ensure the path is correct
  export default {
    components: {
      'password-generator': PasswordGenerator
    },
    props: {
      entry: Object
    },
    name: 'PasswordManagerComponent',
    data() {
      return {
        showPassword: false,
        localEntry: JSON.parse(JSON.stringify(this.entry)) || {
          identy: '',
          website: '',
          username: '',
          password: '',
          uri: '',
          timestamp: ''
        },
        snackbar: false,
        snackbarText: '',
        snackbarColor: '',
        showDetail: false,
        isModal: false, // 控制是否以模態形式顯示
        valid: true,
        requiredRules: [
          v => !!v || '此欄位必填',
        ],
        urlRules: [
          v => !!v || '此欄位必填',
          v => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(:\d+)?(\/[\w .-]*)*(\?.*)?$/
          .test(v) || '請輸入有效的網址'
        ],
        strength: 0,
        strengthColor: 'grey',
        trackColor: 'lightgrey'

      };
    },
    watch: {
      // 当 prop 更新时，更新本地副本
      entry(newVal) {
        this.localEntry = JSON.parse(JSON.stringify(newVal));
      }
    },
    computed: {
      passwordFieldType() {
        return this.showPassword ? 'text' : 'password';
      },
      passwordButtonLabel() {
        return this.showPassword ? '隱藏' : '顯示';
      },
      strengthLabel() {
        if (this.strength === 0) return '無';
        else if (this.strength > 0 && this.strength <= 25) return '弱';
        else if (this.strength > 25 && this.strength <= 50) return '中';
        else if (this.strength > 50 && this.strength <= 75) return '強';
        else if (this.strength > 75) return '非常強';
        else return '未知'; // 確保所有情況下都有返回值
      }
    },
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      saveentry() {
        // 确定是创建还是更新
        const url = this.showDetail ? `/api/entries/${this.localEntry.identy}` : '/api/entries';
        const method = this.showDetail ? 'put' : 'post';

        this.$http({
            method: method,
            url: url,
            data: this.localEntry
          })
          .then(response => {
            console.log('Entry saved:', response);
            this.snackbar = true;
            this.snackbarText = 'Entry saved successfully!';
            this.snackbarColor = 'success';
            this.showDetail = false;
            this.$emit('saveentry');
          })
          .catch(error => {
            console.error('Error saving the entry:', error);
            this.snackbar = true;
            this.snackbarText = 'Error saving the entry';
            this.snackbarColor = 'error';
          });
      },
      open(create) {
        if (create) {
          this.showDetail = false;
          this.isModal = true; // 假設 `isModal` 是控制是否以浮動視窗形式顯示的數據屬性
          this.localEntry.website = '';
          this.localEntry.username = '';
          this.localEntry.password = '';
          this.localEntry.uri = '';
        } else {
          this.showDetail = true;
          this.isModal = false; // 確保不以浮動視窗形式顯示
          this.localEntry = JSON.parse(JSON.stringify(this.entry));
          // 使用 $nextTick 確保 searchInput 的更新已經傳遞給子組件
          this.$nextTick(() => {
            this.updatePasswordStrength(); // 调用更新密码强度的方法
          });
        }
      },
      close() {
        this.showDetail = false;
        this.isModal = false;
      },
      copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
          // 這裡可以添加一些提示，比如顯示一個消息告知用戶已複製。
          this.snackbar = true;
          this.snackbarText = 'Text copied to clipboard!';
          this.snackbarColor = 'success';
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      },
      updatePasswordStrength() {
        const length = this.localEntry.password;
        const hasNumbers = /\d/.test(this.localEntry.password);
        /* eslint-disable no-useless-escape */
        const hasSpecial = /[!@#\$%\^\&*\)\(+=._-]/.test(this.localEntry.password);
        /* eslint-enable no-useless-escape */
        const hasMixedCase = /[a-z]/.test(this.password) && /[A-Z]/.test(this.localEntry.password);

        let strength = 0;
        if (length >= 8) strength += 25;
        if (hasNumbers) strength += 25;
        if (hasSpecial) strength += 25;
        if (hasMixedCase) strength += 25;

        this.strength = strength;

        // Update color based on strength
        if (strength < 25) {
          this.strengthColor = 'red';
        } else if (strength < 50) {
          this.strengthColor = 'orange';
        } else if (strength < 75) {
          this.strengthColor = 'yellow';
        } else {
          this.strengthColor = 'green';
        }
      },
    }
  };
</script>

<style scoped>
  @import '@/assets/css/main.css';

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: opacity .5s ease, transform .5s ease;
  }

  .slide-fade-enter,
  .slide-fade-leave-to

  /* .slide-fade-leave-active in <2.1.8 */
    {
    opacity: 0;
    transform: translateX(100%);
  }
</style>