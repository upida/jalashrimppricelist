<template>
  <c-box>
    <b-navbar class="row mb-2" type="light" variant="light">
      <c-box 
        v-if="load.pricelist"
        class="col"
        border-width="1px"
        rounded="lg"
        bg="white"
        p="4"
        font-weight="semibold"
        letter-spacing="wide"
        font-size="lg">
        <c-spinner />
      </c-box>
      <c-box 
        v-else
        class="col"
        border-width="1px"
        rounded="lg"
        bg="white"
        p="4"
        font-weight="semibold"
        letter-spacing="wide"
        font-size="lg">
        {{pricelist.data.region?.full_name??''}}
      </c-box>
    </b-navbar>
    <div class="row mb-2">
      <c-box class="col-md-6 col-sm-12" border-width="1px" rounded="lg" bg="white" p="4">
        <c-heading 
          color="gray.500"
          font-weight="semibold"
          letter-spacing="wide"
          font-size="sm"
          ml="2"
          mb="2"
        >
          Shrimp Price Detail
        </c-heading>
        <c-box
          v-if="load.pricelist"
          p="4"
        >
          <c-spinner />
        </c-box>
        <c-box
          v-else
          class="row"
          p="4"
        >
          <c-box class="col">
            <small>{{pricelist.data.species?.created_at??''}}</small>
            <p>{{pricelist.data.species?.aliases??''}} ({{pricelist.data.species?.name??''}})</p>
          </c-box>
          <c-box class="col">
            <small>Supplier:</small>
            <p>{{pricelist.data.creator?.name??''}}</p>
          </c-box>
          <c-box class="col">
            <small>Contact:</small>
            <p>{{pricelist.data.creator?.phone??''}}</p>
          </c-box>
        </c-box>
        <c-box
          v-if="load.pricelist"
          p="4"
        >
          <c-spinner />
        </c-box>
        <b-table v-else stacked :items="table"></b-table>
      </c-box>
      <c-box class="col-md-6 col-sm-12" border-width="1px" rounded="lg" bg="white" p="4">
        <c-heading 
          color="gray.500"
          font-weight="semibold"
          letter-spacing="wide"
          font-size="sm"
          ml="2"
          mb="2"
        >
          Historical Price In {{pricelist.data.region?.full_name??''}}
        </c-heading>
        <c-box p="4"> 
          <c-tabs variant="soft-rounded" variant-color="green">
            <c-tab-list>
              <c-tab>History</c-tab>
              <c-tab>Prediction</c-tab>
            </c-tab-list>
            
            <c-tab-panels>
              <c-tab-panel>
                <c-box
                  v-if="load.history"
                  p="4"
                >
                  <c-spinner />
                </c-box>
                <c-box v-else class="row" p="4">
                  <c-box
                    color="gray.500"
                    font-weight="semibold"
                    letter-spacing="wide"
                    font-size="s"
                    ml="2"
                    mb="2"
                  >
                    <v-datepicker v-model="time" range></v-datepicker>
                  </c-box>
                  <v-chart-line
                    :options="chart_history.options"
                    :data="chart_history.data"
                    v-if="chart_history.generate"
                  />
                </c-box>
              </c-tab-panel>
              <c-tab-panel>
                <c-box
                  v-if="load.prediction"
                  p="4"
                >
                  <c-spinner />
                </c-box>
                <c-box v-else class="row" p="4">
                  <c-box
                    color="gray.500"
                    font-weight="semibold"
                    letter-spacing="wide"
                    font-size="s"
                    ml="2"
                    mb="2"
                  >
                    Predictions for next week
                  </c-box>
                  <b-table :items="tablePrediction"></b-table>
                </c-box>
              </c-tab-panel>
            </c-tab-panels>
          </c-tabs>
        </c-box>
      </c-box>
    </div>
    <c-box class="row mb-2" border-width="1px" rounded="lg" bg="white" p="4">
      <c-heading 
        color="gray.500"
        font-weight="semibold"
        letter-spacing="wide"
        font-size="sm"
        ml="2"
        mb="2"
      >
        Other Prices
      </c-heading>
      <c-box class="d-flex flex-row" style="overflow-y:auto;max-height:200px" p="4">
        <c-box
          v-if="load.otherpricelist"
          p="4"
        >
          <c-spinner />
        </c-box>
        <c-box v-else v-for="(chartdata, charkey) in otherpricelist.data" :key="charkey" class="col-auto" border-width="1px" rounded="lg" bg="white" p="4">
          <c-box
            color="gray.500"
            font-weight="semibold"
            letter-spacing="wide"
            font-size="s"
            ml="2"
            mb="2"
          >
            {{chartdata.region.full_name}}
          </c-box>
          <c-box>
            Size 100 : {{chartdata.size_100}}
            <c-button @click="go(chartdata.id)">Detail</c-button>
          </c-box>
        </c-box>
      </c-box>
    </c-box>
  </c-box>
</template>

<script lang="js">
import { 
  CBox, 
  CButton, 
  CIcon, 
  CAspectRatioBox,
  CTabs,
  CTabList,
  CTabPanels,
  CTab,
  CTabPanel,
  CHeading,
  CSpinner
} from '@chakra-ui/vue'

import moment from 'moment'

export default {
  components: {
    CBox,
    CButton,
    CIcon,
    CAspectRatioBox,
    CTabs,
    CTabList,
    CTabPanels,
    CTab,
    CTabPanel,
    CHeading,
    CSpinner
  },
  data() {
    return {
      load: {
        pricelist: false,
        otherpricelist: false,
        prediction: false,
        history: false
      },
      time: [
        moment().subtract(6,'d').toDate(),
        moment().toDate()
      ],
      table: [
        { 
          size_30: 0, 
          size_40: 0, 
          size_50: 0, 
          size_60: 0, 
          size_70: 0, 
          size_80: 0, 
          size_90: 0, 
          size_100: 0
        }
      ],
      tablePrediction: [],
      chart_history: {
        generate: false,
        data: {
          labels: [],
          datasets: [
            {
              label: 'Size 100',
              backgroundColor: 'rgba(253, 253, 150, 0.5)',
              data: [],
              fill: true,
              borderColor: '#FDFD96',
            },
            {
              label: 'Size 70',
              backgroundColor: 'rgba(172, 216, 236, 0.5)',
              data: [],
              fill: true,
              borderColor: '#ABD7EB',
            },
            {
              label: 'Size 40',
              backgroundColor: 'rgba(248, 119, 119, 0.5)',
              data: [],
              fill: true,
              borderColor: '#f87979',
            }
          ]
        },
        options: {
          responsive: true
        }
      },
      chart: {
        regions: [18, 35, 33, 36],
        data: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July'
          ],
          datasets: [
            {
              label: 'Size 100',
              backgroundColor: 'rgba(253, 253, 150, 0.5)',
              data: [10, 40, 39, 80, 40, 40, 39],
              fill: true,
              borderColor: '#FDFD96',
            },
            {
              label: 'Size 70',
              backgroundColor: 'rgba(172, 216, 236, 0.5)',
              data: [40, 39, 80, 40, 40, 39, 10],
              fill: true,
              borderColor: '#ABD7EB',
            },
            {
              label: 'Size 40',
              backgroundColor: 'rgba(248, 119, 119, 0.5)',
              data: [40, 39, 10, 40, 39, 80, 40],
              fill: true,
              borderColor: '#f87979',
            }
          ]
        },
        options: {
          responsive: true
        },
      },
      pricelist: {
        data: [],
        links: {
          first: null,
          last: null,
          prev: null,
          next: null
        },
        meta: {
          current_page: null,
          from: null,
          last_page: null,
          path: null,
          per_page: null,
          to: null,
          total: null
        }
      },
      otherpricelist: {
        data: [],
        links: {
          first: null,
          last: null,
          prev: null,
          next: null
        },
        meta: {
          current_page: null,
          from: null,
          last_page: null,
          path: null,
          per_page: null,
          to: null,
          total: null
        }
      },
      history: {
        data: [],
        links: {
          first: null,
          last: null,
          prev: null,
          next: null
        },
        meta: {
          current_page: null,
          from: null,
          last_page: null,
          path: null,
          per_page: null,
          to: null,
          total: null
        }
      },
      prediction: []
    }
  },
  methods: {
    async getPricelist() {
      this.load.pricelist = true;
      var data = { with: 'species,region,currency,country' };
      var searchParams = new URLSearchParams(data);
      searchParams = searchParams.toString();
      var data = await this.http.get('https://app.jala.tech/api/shrimp_prices/'+this.$route.params.id+'?'+searchParams);
      this.load.pricelist = false;
      return data.data;
    },
    async getOtherPricelist() {
      this.load.otherpricelist = true;
      var data = { with: 'region,currency,country' };
      var searchParams = new URLSearchParams(data);
      searchParams = searchParams.toString();
      var data = await this.http.get('https://app.jala.tech/api/shrimp_prices?'+searchParams);
      this.load.otherpricelist = false;
      return data.data;
    },
    async getPrediction() {
      this.load.prediction = true;
      var data = { shrimp_size: 'avg_size_40,avg_size_70,avg_size_100', region_id: this.$route.params.id };
      var searchParams = new URLSearchParams(data);
      searchParams = searchParams.toString();
      var data = await this.http.get('https://app.jala.tech/api/shrimp_price_prediction?'+searchParams);
      this.load.prediction = false;
      return data.data;
    },
    async getHistory() {
      this.load.history = true;
      var data = { country_id:'ID', region_id:this.$route.params.id,currency_id:'IDR',per_page:'1000' };
      var searchParams = new URLSearchParams(data);
      searchParams = searchParams.toString();
      var data = await this.http.get('https://app.jala.tech/api/shrimp_prices?'+searchParams);
      this.load.history = false;
      return data.data;
    },
    getChartHistory() {
      this.chart_history.generate = false
      var data = this.history.data.filter(e => moment(e.created_at).toDate() >= this.time[0] && moment(e.created_at).toDate() <= this.time[1]);
      var labels = data.map(e => moment(e.created_at).format('ll').toString())
      labels = labels.filter((item, i, ar) => ar.indexOf(item) === i)
      
      this.chart_history.data = {
        labels: [],
        datasets: []
      }

      var records = [];
      var chartdatasets = [
        {
          label: 'Size 100',
          backgroundColor: 'rgba(253, 253, 150, 0.5)',
          data: [],
          fill: true,
          borderColor: '#FDFD96',
        },
        {
          label: 'Size 70',
          backgroundColor: 'rgba(172, 216, 236, 0.5)',
          data: [],
          fill: true,
          borderColor: '#ABD7EB',
        },
        {
          label: 'Size 40',
          backgroundColor: 'rgba(248, 119, 119, 0.5)',
          data: [],
          fill: true,
          borderColor: '#f87979',
        }
      ];

      for (let val of data) {
        var currentdate = moment(val.created_at).format('ll').toString();
        if (
          labels.includes(currentdate) &&
          !records.includes(currentdate)
        ) {
          chartdatasets[0].data.push(val.size_100 ?? 0)
          chartdatasets[1].data.push(val.size_70 ?? 0)
          chartdatasets[2].data.push(val.size_40 ?? 0)
          records.push(currentdate)
        }
      }
      
      this.chart_history.generate = true
      
      this.chart_history.data = {
        labels: labels,
        datasets: chartdatasets
      }
    },
    getTablePrediction() {
      this.tablePrediction = [
        {
          size: '40',
          min_price: this.prediction[0][0].min,
          max_price: this.prediction[0][0].max
        },
        {
          size: '70',
          min_price: this.prediction[1][0].min,
          max_price: this.prediction[1][0].max
        },
        {
          size: '100',
          min_price: this.prediction[2][0].min,
          max_price: this.prediction[2][0].max
        },
      ]
    },
    go(id) {
      if (id != this.$route.params.id) {
        this.$router.push('/'+id)
      }
    }
  },
  watch: {
    '$route.params.id': {
      async handler(val){
        this.pricelist = await this.getPricelist();

        this.table = [{ 
          size_30: this.pricelist.data.size_30, 
          size_40: this.pricelist.data.size_40, 
          size_50: this.pricelist.data.size_50, 
          size_60: this.pricelist.data.size_60, 
          size_70: this.pricelist.data.size_70, 
          size_80: this.pricelist.data.size_80, 
          size_90: this.pricelist.data.size_90, 
          size_100: this.pricelist.data.size_100
        }];

        this.prediction = await this.getPrediction();
        this.getTablePrediction();

        this.otherpricelist = await this.getOtherPricelist();

        this.history = await this.getHistory();
        this.getChartHistory();

      },
      deep: true
    },
    time(val) {
      this.getChartHistory()
    }
  },
  async mounted() {
    this.pricelist = await this.getPricelist();
    this.table = [{ 
      size_30: this.pricelist.data.size_30, 
      size_40: this.pricelist.data.size_40, 
      size_50: this.pricelist.data.size_50, 
      size_60: this.pricelist.data.size_60, 
      size_70: this.pricelist.data.size_70, 
      size_80: this.pricelist.data.size_80, 
      size_90: this.pricelist.data.size_90, 
      size_100: this.pricelist.data.size_100
    }];

    this.prediction = await this.getPrediction();
    this.getTablePrediction();

    this.otherpricelist = await this.getOtherPricelist();

    this.history = await this.getHistory();
    this.getChartHistory();

    console.log('pricelist', this.pricelist.data);
    console.log('prediction', this.prediction);
    console.log('otherpricelist', this.otherpricelist.data);
    console.log('history', this.history.data);
  }
}
</script>