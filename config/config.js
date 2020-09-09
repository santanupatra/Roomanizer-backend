const defaultData = {
  SECRET_KEY: 'nodeJS-mongoDBsecretkey',
  EXPIRES_IN: '30d', // expires in 30 days
  SALT_ROUND: 10,
  JWT_ALGORITHM: 'HS256',
  HOST_EMAIL: 'roomanizer',
  HOST_EMAIL_PASSWORD: 'rooman1zer2020',
  OTP_EMAILTEMPLATE_PRIMARY_ID:'',
  SETTING_PRIMARY_ID:"5f225e15b67f371151514aed",
  // WEB_URL: 'http://111.93.169.90:5074/',
  DATABASE_URI: 'mongodb://roomanizer:rooman1zer2020@111.93.169.90:27929/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
  // IMAGE_PATH: '/image/',
  // USER_IMAGE_PATH: '/userImage/',
  // SERVICE_IMAGE_PATH: '/serviceImage/',
  // LOGO_IMAGE_PATH: '/logo/',
  // MEAL_IMAGE_PATH: '/MealImage/',
}

export default defaultData;