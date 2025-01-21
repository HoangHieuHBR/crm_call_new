export function getContentTicketTask(object) {
  const array = [];
  Object.keys(object).forEach(key => {
    array.push(`${key}: ${object[key]}`)
  })
  return array.join('\r\n');
}
