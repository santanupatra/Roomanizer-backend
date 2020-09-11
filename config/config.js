const defaultData = {
  SECRET_KEY: 'nodeJS-mongoDBsecretkey',
  EXPIRES_IN: '30d', // expires in 30 days
  SALT_ROUND: 10,
  JWT_ALGORITHM: 'HS256',
  HOST_EMAIL: 'roomanizer',
  HOST_EMAIL_PASSWORD: 'rooman1zer2020',
  HOST_EMAIL_1: 'mail@cbnits.com',
  HOST_EMAIL_PASSWORD_1: ' w#llcbn1ts',
  OTP_EMAILTEMPLATE_PRIMARY_ID:'',
  SETTING_PRIMARY_ID:"5f588a2411a84034b8bb3fbf",
  // WEB_URL: 'http://111.93.169.90:5074/',
  DATABASE_URI: 'mongodb://roomanizer:rooman1zer2020@111.93.169.90:27929/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
  IMAGE_PATH: '/image/',
  USER_IMAGE_PATH: '/userImage/',
  // SERVICE_IMAGE_PATH: '/serviceImage/',
   LOGO_IMAGE_PATH: '/logo/',
  // MEAL_IMAGE_PATH: '/MealImage/',
}

export default defaultData;