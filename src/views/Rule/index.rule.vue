<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-card>
          <v-subheader>Область загрузки аккаунтов в систему</v-subheader>
          <v-card-text>
            <v-file-input
              v-model="logFile"
              accept=".txt"
              label="Кликни чтоб загрузить файл"
              outlined
            ></v-file-input>
            <v-btn @click="sendFile" :disabled="!logFile" :loading="loadLogFile">Загрузить</v-btn>

          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="categories"
            :items-per-page="20"
            class="elevation-1"
          >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Категории</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    text
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Добавить категорию
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Добавление категории</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                        >
                          <v-text-field
                            v-model="editedItemName"
                            :hint="strictMode ? 'Название категории является фильтром': 'Название категории'"
                            label="Название категории"
                          ></v-text-field>
                          <v-text-field
                            v-if="!strictMode"
                            v-model="ruleCategory"
                            label="Общие правила фильтров"
                            hint="skins: [<>=] строка или число, region: = строка"
                          ></v-text-field>
                          <v-text-field
                            v-model="ruleAccount"
                            label="Правило фильтров для аккаунта"
                            hint="ban := yes/no, valorantPt := 1-n"
                          ></v-text-field>
                          <v-text-field
                            v-model="weightCategory"
                            label="Вес категории"
                            type="number"
                          ></v-text-field>
                          <v-switch
                            v-model="strictMode"
                            label="режим строгого соответсвия"
                          ></v-switch>
                           <v-switch
                            v-model="validateAccount"
                            label="Проверять аккаунт в RIOT"
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      Отмена
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                    >
                      Сохранить
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog
                v-model="editItemDialog"
                max-width="500px"
              >
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Редактирование категории</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                        >
                          <v-text-field
                            v-model="editedItemName"
                            label="Название категории"
                          ></v-text-field>
                          <v-text-field
                            v-model="ruleCategory"
                            label="Правило фильтров"
                            hint="Доступные фильтры: skins: [<>=] строка или число, region: = строка"
                          ></v-text-field>
                          <v-text-field
                            v-model="weightCategory"
                            label="Вес категории"
                            type="number"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      Отмена
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="saveEdit"
                    >
                      Сохранить
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title> <span>Вы действительно хотите <span class="red--text">удалить</span> категорию</span>?</v-card-title>
                  <v-card-text>При удалении категории удаляются все связанные с ней аккаунты</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="closeDelete">Отмена</v-btn>
                    <v-btn color="error" text @click="deleteItem">Удалить</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                color="primary"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                color="error"
                @click="tmpDeleteItem = item.id, dialogDelete = true"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:item.rule="{item}">
              <v-chip
                class="ma-1"
                color="primary"
                v-for="(r, i) in item.rule.split(',')"
                :key="i"
                label
              >
                {{r}}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import bus from '../../bus'

export default {
  name: 'Rule',
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      editItemDialog: false,
      editedItemId: 0,
      tmpDeleteItem: null,
      editedItemName: '',
      ruleCategory: '',
      weightCategory: 0,
      logFile: null,
      loadLogFile: false,
      strictMode: false,
      ruleAccount: '',
      validateAccount: true,
      headers: [
        { text: 'id', align: 'center', value: 'id' },
        { text: 'Название', align: 'start', value: 'name' },
        { text: 'Правило', align: 'start', value: 'rule' },
        { text: 'Вес', align: 'start', value: 'weight' },
        { text: 'Управление', value: 'actions', sortable: false },
      ]
    }
  },
   watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  computed: {
    categories() {
      return this.$store.getters.getCategories
    }
  },
  methods: {
    sendFile() {
      this.loadLogFile = true
      bus.$emit('setLoadingNotification', 'Файл загружается в систему')
      const reader = new FileReader()
      reader.readAsText(this.logFile)
      reader.onload = () => {
        this.$store.dispatch('createAccount', JSON.stringify(reader.result)).then((res) => {
          const accountLength = res.data.accounts.length
          bus.$emit('killLoadingNotification')
          bus.$emit('setSystemNotification', `Добвлено аккаунтов: ${accountLength}`)
          this.loadLogFile = false
          this.logFile = null
        })
      }
    },
    close() {
      this.dialog = false
      this.editItemDialog = false
      this.editedItemName = ''
      this.ruleCategory = ''
      this.weightCategory = 0
      this.validateAccount = true
      this.strictMode = false
      this.ruleAccount = ''
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
    },
    async save() {
      const payload = {
        name: this.editedItemName,
        rule: `${this.ruleAccount},validate:=${this.validateAccount},strictMode:=${this.strictMode},${this.ruleCategory}`,
        weight: this.weightCategory
      }
      await this.$store.dispatch('createCategory', payload)
      this.close()
    },
    async saveEdit() {
      const payload = {
        id: this.editedItemId,
        name: this.editedItemName,
        rule: this.ruleCategory,
        weight: this.weightCategory
      }
      await this.$store.dispatch('updateCategory', payload)
      this.close()
    },
    editItem(item) {
      this.editItemDialog = true
      this.editedItemName = item.name
      this.editedItemId = item.id
      this.weightCategory = item.weight 
      this.ruleCategory = item.rule
    },
    deleteItem() {
      this.$store.dispatch('deleteCategory', {id: this.tmpDeleteItem})
      this.close()
    },
    makeObj(rules) {
      rules = rules.split(',')
      const obj = {}
      rules.forEach(rule => {
        const r = rule.split(':')
        const key = r[0]
        const value = r[1].split('').slice(1).join('')
        obj[key] = value
      })
      return obj
    }
  },
  mounted() {
    this.$store.dispatch('findCategories')
  }
}
</script>
