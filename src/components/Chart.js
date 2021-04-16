import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const Chart = ({ stocks, dates }) => {
const options = {
  series: stocks
  ,
  chart: {
        type: 'area'
    },
    title: {
        text: 'My asset portfolio'
    },
    subtitle: {
        text: 'Stu\'s investments'
    },
    xAxis: {
        categories: dates,
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: '$1000'
        },
        labels: {
          formatter: function () {
              return this.value / 1000;
          }
        }
    },
    tooltip: {
        split: true,
        valuePrefix: '$'
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    }
}

return (
  <HighchartsReact
  highcharts={Highcharts}
  options={options}
/>
  )
}
export default Chart
