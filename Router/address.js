// const baseurl = 'https://parking.opentech4u.co.in/api/parking'
const baseurl = 'http://192.168.1.8/sss/parking/api/parking'
// const baseurl = 'http://192.168.1.218/sss/powercraft/api/parking'

// const baseurl2 = 'https://parking.opentech4u.co.in/api'
const baseurl2 = 'http://192.168.1.8/sss/parking/api'

exports.address={
  login:`${baseurl}/login`,
  createAccount:`${baseurl}/create-user`,
  enter:`${baseurl}/enter`,
  leave:`${baseurl}/leave`,
  getSetting:`${baseurl}/setting`,
  vehicle:`${baseurl}/vehicle`,
  employees:`${baseurl}/employees`,
  shiftList:`${baseurl}/shift-list`,
  changePassWord:`${baseurl}/user-edit`,
  searchLocation:`${baseurl2}/common/serch-location`,
  employeeEdit:`${baseurl}/employee-edit`,
  carIn:`${baseurl}/car-in`,
  carOut:`${baseurl}/car-out`,
  carInv2:`${baseurl}/v2/car-in`,
  carOutv2:`${baseurl}/v2/car-out`,
  rate:`${baseurl}/rate`,
  receipt_amt:`${baseurl}/receipt-amt`,
  getCarDetails:`${baseurl}/chueked-car-in-time`,
  unbilledReports:`${baseurl}/unbilled`,
  advance:`${baseurl}/advance`,
  receiptSettings:`${baseurl}/get_receopt_setting`,
  gstSettings:`${baseurl}/gist_list`,
  isUser:`${baseurl}/check_user`,
  fixed_rate:`${baseurl}/fixed_rate`,
  uploaddbfile:`${baseurl}/upload-database-backup`,
}