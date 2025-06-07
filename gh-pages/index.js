const select = document.getElementById('label-select')
const sections = ['all', 'shopping', 'emergency']
function updateDisplay() {
  const value = select.value
  sections.forEach(id => {
    document.getElementById(id).style.display = (id === value) ? '' : 'none'
  })
  const totalClasses = ['all-total', 'shopping-total', 'emergency-total']
  totalClasses.forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(el => {
      el.style.display = 'none'
    })
  })
  if (value === 'all') {
    document.querySelectorAll('.all-total').forEach(el => { el.style.display = '' })
  } else if (value === 'shopping') {
    document.querySelectorAll('.shopping-total').forEach(el => { el.style.display = '' })
  } else if (value === 'emergency') {
    document.querySelectorAll('.emergency-total').forEach(el => { el.style.display = '' })
  }
}
select.addEventListener('change', updateDisplay)
updateDisplay()
const toggle = document.getElementById('device-list-toggle')
const content = document.getElementById('device-list-content')
toggle.addEventListener('click', function () {
  content.classList.toggle('open')
})