<template>
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" right bottom>
    {{ snackbarText }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-container>
    <!-- Password Display -->
    <v-text-field v-model="password" label="產生密碼" readonly append-inner-icon="mdi-content-copy" @click:append-inner="copyText(password)"></v-text-field>

    <!-- Slider for Password Length -->
    <v-slider v-model="passwordLength" :max="30" :min="5" step="1" label="密碼長度" thumb-label="always"></v-slider>
    <v-slider v-model="strength" :label="strengthLabel" :color="strengthColor" :track-color="trackColor" min="0" max="100" readonly ></v-slider> <!-- Checkboxes for Password Criteria -->
    <v-checkbox v-model="includeUppercase" label="包含大寫 (A-Z)"></v-checkbox>
    <v-checkbox v-model="includeLowercase" label="包含小寫 (a-z)"></v-checkbox>
    <v-checkbox v-model="includeNumbers" label="包含數字 (0-9)"></v-checkbox>
    <v-checkbox v-model="includeSymbols" label="包含特殊符號 (&amp;#@)"></v-checkbox>

    <!-- Generate Button -->
    <v-btn @click="generatePassword">產生密碼</v-btn>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        password: '',
        passwordLength: 11,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        showPassword: false,
        strength: 0,
        strengthColor: 'grey',
        trackColor: 'lightgrey'
      };
    },
    computed: {
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
      generatePassword() {
        // The password generation logic will be implemented here.
        const charset = this.getCharset();
        this.password = this.createPassword(charset, this.passwordLength);
        this.updatePasswordStrength(); // 调用更新密码强度的方法
      },
      getCharset() {
        let charset = '';
        if (this.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (this.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (this.includeNumbers) charset += '0123456789';
        if (this.includeSymbols) charset += '!@#$%^&*()_+=-[]{}|;:",.<>?';

        return charset;
      },
      createPassword(charset, length) {
        let password = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        return password;
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
        const length = this.password.length;
        const hasNumbers = /\d/.test(this.password);
        /* eslint-disable no-useless-escape */
        const hasSpecial = /[!@#\$%\^\&*\)\(+=._-]/.test(this.password);
        /* eslint-enable no-useless-escape */
        const hasMixedCase = /[a-z]/.test(this.password) && /[A-Z]/.test(this.password);

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
    },
  };
</script>