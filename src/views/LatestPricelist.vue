<template>
  <c-box>
    <b-navbar class="row mb-2" type="light" variant="light">
      <c-box class="col">
        <v-select
          placeholder="Location"
          v-model="filter.active.region"
          :options="filter.options.region"
          @search="getFilterOptionsLocation"
        />
      </c-box>
      <c-box class="col">
        <v-select placeholder="Size" label="countryName" v-model="filter.active.size" :options="filter.options.size"></v-select>
      </c-box>
      <c-box class="col">
        <v-select placeholder="Type" label="countryName" v-model="filter.active.type" :options="filter.options.type"></v-select>
      </c-box>
    </b-navbar>
    <div class="row mb-2">
      <c-box class="col-md-6 col-sm-12" border-width="1px" rounded="lg" bg="white" p="4">
        <c-box
          color="gray.500"
          font-weight="semibold"
          letter-spacing="wide"
          font-size="s"
          ml="2"
          mb="2"
        >
          Shrimp Prices Distribution Size 20
        </c-box>
        <c-aspect-ratio-box>
          <c-box
            as="iframe"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2025969.5818681654!2d110.72380901842044!3d-7.357053094537804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1675617929592!5m2!1sen!2sid"
            frameborder="0"
            allowfullscreen="true"
            aria-hidden="false"
            tabindex="0"
            width="100%"
            height="100%"
            alt="Jawa Tengah, Indonesia"
          />
        </c-aspect-ratio-box>
      </c-box>
      <c-box class="col-md-6 col-sm-12" border-width="1px" rounded="lg" bg="white" p="4">
        <c-box
          color="gray.500"
          font-weight="semibold"
          letter-spacing="wide"
          font-size="s"
          ml="2"
          mb="2"
        >
          Prices trend in various regions
        </c-box>
        <c-box class="row" p="4">
          <c-box v-for="(chartdata, charkey) in chart.data" :key="charkey" class="col col-lg-6" border-width="1px" rounded="lg" bg="white" p="4">
            <c-box
              color="gray.500"
              font-weight="semibold"
              letter-spacing="wide"
              font-size="s"
              ml="2"
              mb="2"
            >
              {{chartdata.region}}
            </c-box>
            <v-chart-line
              :options="chart.options"
              :data="chartdata"
            />
          </c-box>
        </c-box>
      </c-box>
    </div>
    <c-box class="row mb-2" border-width="1px" rounded="lg" bg="white" p="4">
      <c-box
        color="gray.500"
        font-weight="semibold"
        letter-spacing="wide"
        font-size="s"
        ml="2"
        mb="2"
      >
        List Shrimp Prices
      </c-box>
      <v-client-table
        v-infinite-scroll="onScrollTable"
        :data="table.data"
        :columns="table.columns"
        :options="table.options"
      >
        <template v-slot:Detail="props">
            <c-button @click="$router.push({ name: 'detailpricelist', params: { id: props.row.id } })">See Detail</c-button>
        </template>
      </v-client-table>
    </c-box>
  </c-box>
</template>

<script lang="js">
import { CBox, CButton, CIcon, CAspectRatioBox } from '@chakra-ui/vue'
import _ from 'lodash'

export default {
  components: {
    CBox,
    CButton,
    CIcon,
    CAspectRatioBox
  },
  data() {
    return {
      chart: {
        regions: [18, 35, 33, 36],
        data: [],
        options: {
          responsive: true,
          plugins:{
            legend: false
          },
          scales: {
              y: {
                  display: false // Hide Y axis labels
              },
              x: {
                  display: false // Hide X axis labels
              }
          }
        },
      },
      filter: {
        options: {
          region: [],
          size: [
            '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190', '200'
          ],
          type: [
            'Vannamei'
          ]
        },
        active: {
          region: null,
          size: '100',
          type: 'Vannamei'
        }
      },
      table: {
        busy: false,
        page: 1,
        columns: [],
        data: [],
        options: {
          sortable: true,
          filterable: false,
          stickyHeader: true,
          stickyHeaderBackground: 'white',
          pagination: {
            show: true,
            virtual: true
          }
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
      regions: {
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
      }
    }
  },
  methods: {
    async getPricelist(region = '', size = '', page = null) {
      var data = { with: 'region' };
      if (region) data.region_id = region;
      if (size) data.not_null = 'size_'+size;
      if (page) data.page = page;

      var searchParams = new URLSearchParams(data);
      searchParams = searchParams.toString();
      var data = await this.http.get('https://app.jala.tech/api/shrimp_prices?'+searchParams);
      return data.data;
    },
    async getRegions(search = '') {
      var data = { has: 'shrimp_prices' };
      if (search) data.search = search;
      var searchParams = new URLSearchParams(data);
      searchParams = searchParams.toString();
      
      var data = await this.http.get('https://app.jala.tech/api/regions?'+searchParams);
      return data.data;
    },
    async getTrend() {
      this.chart.data = [];
      for(let val of this.chart.regions){
        var urlparams = {
          region_id: val,
          not_null: 'size_'+this.filter.active.size
        }
        var searchParams = new URLSearchParams(urlparams);
        searchParams = searchParams.toString();
        
        var region = await this.http.get('https://app.jala.tech/api/regions/'+val);
        var priceperweek = await this.http.get('https://app.jala.tech/api/shrimp_prices_per_week?'+searchParams);

        var chart = {
          region: region.data.data.full_name,
          labels: [],
          datasets: [{
            backgroundColor: '#C2E2C3',
            data: [],
            fill: true,
            borderColor: '#C2E2C3',
          }]
        }
        for (let price of priceperweek.data.data) {
          chart.labels.push(price.date);
          chart.datasets[0].data.push(price['avg_size_'+this.filter.active.size]);
        }
        this.chart.data.push(chart);
      }
    },
    getFilterOptionsLocation: _.debounce(async function(search, loading) {
      loading(true)
      var data = await this.getRegions(search ?? '')
      this.filter.options.region = data.data.map(function(a) {
        return { id: a.id, label: a.full_name }
      });
      loading(false)
    }, 200),
    onScrollTable: _.debounce(async function() {
      if (!this.table.busy && this.table.page < this.pricelist.meta.last_page) {
        this.table.busy = true;
        this.table.page++;
        var data = await this.getPricelist(this.filter.active.region?.id ?? '', this.filter.active.size, this.table.page);
        if (data.data.length > 0) this.pricelist.data.push(...data.data);
        this.table.busy = false;
      }
    }, 500)
  },
  watch: {
    'filter.active': {
      async handler(newval, oldval){
        var region = newval.region?.id ?? ''
        var size = newval.size ?? ''
        this.table.page = 1
        this.pricelist = await this.getPricelist(region, size, this.table.page);
        await this.getTrend()
      },
      deep: true
    },
    'pricelist': {
      async handler(val){
        var data = [];
        if (this.filter.active.size) {
          var price_column = 'Price Size '+this.filter.active.size;
          var price_value = 'size_'+this.filter.active.size;
          for(let [key, value] of Object.entries(val.data)) {
            var temp = {
              id: value.id,
              'Date': value.date,
              'Location': value.region.full_name,
              'Supplier': value.contact
            }
            temp[price_column] = value[price_value]
            data.push(temp)
          }
        }
        this.table.columns = [
          'Date', 'Location', 'Supplier', price_column, 'Detail'
        ];
        this.table.data = data;
      },
      deep: true
    }
  },
  async mounted() {
    this.pricelist = await this.getPricelist(this.filter.active.region, this.filter.active.size);
    this.regions = await this.getRegions();
    this.filter.options.region = this.regions.data.map(function(a) {
      return { id: a.id, label: a.full_name }
    });
    await this.getTrend();
  }
}
</script>