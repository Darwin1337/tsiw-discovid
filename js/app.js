import NavbarView from "./views/NavbarView.js";
import ProfileView from "./views/ProfileView.js";
import AdminUsersView from "./views/AdminUsersView.js";
import AdminProdutosView from "./views/AdminProdutosView.js";
import AutenticacaoView from "./views/AutenticacaoView.js";
import RegistoNormalView from "./views/RegistoNormalView.js";
import RegistoEntidadeView from "./views/RegistoEntidadeView.js";
import LojaView from "./views/LojaView.js";
import IndexView from "./views/IndexView.js";
import PostosView from "./views/PostosView.js";
import EncomendasView from "./views/EncomendasView.js";
import AdminGamificacoesView from "./views/AdminGamificacoesView.js";
import MarcacoesView from "./views/MarcacoesView.js";

// Import de controllers para a 'dummy data' ficar mais legível, não muito extensa e para não haver problemas com id's
import UserController from "./controllers/UserController.js";
import TestsController from "./controllers/TestsController.js";
import LocaleController from "./controllers/LocaleController.js";
import LojaController from "./controllers/LojaController.js";
import EncomendasController from "./controllers/EncomendasController.js";
import AvaliacoesController from "./controllers/AvaliacoesController.js";
import GamificacoesController from "./controllers/GamificacoesController.js";
import MarcacoesController from "./controllers/MarcacoesController.js";

class App {
  constructor() {
    this.indexInstance = null;
    this.routes = {
      '': [NavbarView, IndexView],
      'index': [NavbarView, IndexView],
      'default': [NavbarView, IndexView],
      'autenticacao': [NavbarView, AutenticacaoView],
      'registo-normal': [NavbarView, RegistoNormalView],
      'registo-entidade': [NavbarView, RegistoEntidadeView],
      'checkout-1': [NavbarView],
      'checkout-2': [NavbarView],
      'checkout-3': [NavbarView],
      'editar-perfil': [NavbarView, ProfileView],
      'marcacoes': [NavbarView, MarcacoesView],
      'encomendas': [NavbarView, EncomendasView],
      'notificacoes': [NavbarView],
      'loja': [NavbarView, LojaView],
      'postos': [NavbarView, PostosView],
      'sintomas': [NavbarView],
      'testes': [NavbarView],
      'tracking': [NavbarView],
      'admin-entidades': [AdminUsersView],
      'admin-utilizadores': [AdminUsersView],
      'admin-produtos': [AdminUsersView, AdminProdutosView],
      'admin-gamificacoes': [AdminUsersView, AdminGamificacoesView]
    };
    this.#importDataFixtures();
    this.#instantiateViews();
  }

  #importDataFixtures() {
    // Localidades - aqui é usado JQuery para evitar as burocracias do plain javascript (XMLHttpRequest)
    const localidades = [
      {
        "id": 1,
        "nome": "ABRANTES"
      }, {
        "id": 2,
        "nome": "ÁGUEDA"
      }, {
        "id": 3,
        "nome": "AGUIAR DA BEIRA"
      }, {
        "id": 4,
        "nome": "ALANDROAL"
      }, {
        "id": 5,
        "nome": "ALBERGARIA-A-VELHA"
      }, {
        "id": 6,
        "nome": "ALBUFEIRA"
      }, {
        "id": 7,
        "nome": "ALCÁCER DO SAL"
      }, {
        "id": 8,
        "nome": "ALCANENA"
      }, {
        "id": 9,
        "nome": "ALCOBAÇA"
      }, {
        "id": 10,
        "nome": "ALCOCHETE"
      }, {
        "id": 11,
        "nome": "ALCOUTIM"
      }, {
        "id": 12,
        "nome": "ALENQUER"
      }, {
        "id": 13,
        "nome": "ALFÂNDEGA DA FÉ"
      }, {
        "id": 14,
        "nome": "ALIJÓ"
      }, {
        "id": 15,
        "nome": "ALJEZUR"
      }, {
        "id": 16,
        "nome": "ALJUSTREL"
      }, {
        "id": 17,
        "nome": "ALMADA"
      }, {
        "id": 18,
        "nome": "ALMEIDA"
      }, {
        "id": 19,
        "nome": "ALMEIRIM"
      }, {
        "id": 20,
        "nome": "ALMODÔVAR"
      }, {
        "id": 21,
        "nome": "ALPIARÇA"
      }, {
        "id": 22,
        "nome": "ALTER DO CHÃO"
      }, {
        "id": 23,
        "nome": "ALVAIÁZERE"
      }, {
        "id": 24,
        "nome": "ALVITO"
      }, {
        "id": 25,
        "nome": "AMADORA"
      }, {
        "id": 26,
        "nome": "AMARANTE"
      }, {
        "id": 27,
        "nome": "AMARES"
      }, {
        "id": 28,
        "nome": "ANADIA"
      }, {
        "id": 29,
        "nome": "ANGRA DO HEROÍSMO"
      }, {
        "id": 30,
        "nome": "ANSIÃO"
      }, {
        "id": 31,
        "nome": "ARCOS DE VALDEVEZ"
      }, {
        "id": 32,
        "nome": "ARGANIL"
      }, {
        "id": 33,
        "nome": "ARMAMAR"
      }, {
        "id": 34,
        "nome": "AROUCA"
      }, {
        "id": 35,
        "nome": "ARRAIOLOS"
      }, {
        "id": 36,
        "nome": "ARRONCHES"
      }, {
        "id": 37,
        "nome": "ARRUDA DOS VINHOS"
      }, {
        "id": 38,
        "nome": "AVEIRO"
      }, {
        "id": 39,
        "nome": "AVIS"
      }, {
        "id": 40,
        "nome": "AZAMBUJA"
      }, {
        "id": 41,
        "nome": "BAIÃO"
      }, {
        "id": 42,
        "nome": "BARCELOS"
      }, {
        "id": 43,
        "nome": "BARRANCOS"
      }, {
        "id": 44,
        "nome": "BARREIRO"
      }, {
        "id": 45,
        "nome": "BATALHA"
      }, {
        "id": 46,
        "nome": "BEJA"
      }, {
        "id": 47,
        "nome": "BELMONTE"
      }, {
        "id": 48,
        "nome": "BENAVENTE"
      }, {
        "id": 49,
        "nome": "BOMBARRAL"
      }, {
        "id": 50,
        "nome": "BORBA"
      }, {
        "id": 51,
        "nome": "BOTICAS"
      }, {
        "id": 52,
        "nome": "BRAGA"
      }, {
        "id": 53,
        "nome": "BRAGANÇA"
      }, {
        "id": 54,
        "nome": "CABECEIRAS DE BASTO"
      }, {
        "id": 55,
        "nome": "CADAVAL"
      }, {
        "id": 56,
        "nome": "CALDAS DA RAINHA"
      }, {
        "id": 57,
        "nome": "CALHETA"
      }, {
        "id": 58,
        "nome": "CALHETA (AÇORES)"
      }, {
        "id": 59,
        "nome": "CÂMARA DE LOBOS"
      }, {
        "id": 60,
        "nome": "CAMINHA"
      }, {
        "id": 61,
        "nome": "CAMPO MAIOR"
      }, {
        "id": 62,
        "nome": "CANTANHEDE"
      }, {
        "id": 63,
        "nome": "CARRAZEDA DE ANSIÃES"
      }, {
        "id": 64,
        "nome": "CARREGAL DO SAL"
      }, {
        "id": 65,
        "nome": "CARTAXO"
      }, {
        "id": 66,
        "nome": "CASCAIS"
      }, {
        "id": 67,
        "nome": "CASTANHEIRA DE PÊRA"
      }, {
        "id": 68,
        "nome": "CASTELO BRANCO"
      }, {
        "id": 69,
        "nome": "CASTELO DE PAIVA"
      }, {
        "id": 70,
        "nome": "CASTELO DE VIDE"
      }, {
        "id": 71,
        "nome": "CASTRO DAIRE"
      }, {
        "id": 72,
        "nome": "CASTRO MARIM"
      }, {
        "id": 73,
        "nome": "CASTRO VERDE"
      }, {
        "id": 74,
        "nome": "CELORICO DA BEIRA"
      }, {
        "id": 75,
        "nome": "CELORICO DE BASTO"
      }, {
        "id": 76,
        "nome": "CHAMUSCA"
      }, {
        "id": 77,
        "nome": "CHAVES"
      }, {
        "id": 78,
        "nome": "CINFÃES"
      }, {
        "id": 79,
        "nome": "COIMBRA"
      }, {
        "id": 80,
        "nome": "CONDEIXA-A-NOVA"
      }, {
        "id": 81,
        "nome": "CONSTÂNCIA"
      }, {
        "id": 82,
        "nome": "CORUCHE"
      }, {
        "id": 83,
        "nome": "CORVO"
      }, {
        "id": 84,
        "nome": "COVILHÃ"
      }, {
        "id": 85,
        "nome": "CRATO"
      }, {
        "id": 86,
        "nome": "CUBA"
      }, {
        "id": 87,
        "nome": "ELVAS"
      }, {
        "id": 88,
        "nome": "ENTRONCAMENTO"
      }, {
        "id": 89,
        "nome": "ESPINHO"
      }, {
        "id": 90,
        "nome": "ESPOSENDE"
      }, {
        "id": 91,
        "nome": "ESTARREJA"
      }, {
        "id": 92,
        "nome": "ESTREMOZ"
      }, {
        "id": 93,
        "nome": "ÉVORA"
      }, {
        "id": 94,
        "nome": "FAFE"
      }, {
        "id": 95,
        "nome": "FARO"
      }, {
        "id": 96,
        "nome": "FELGUEIRAS"
      }, {
        "id": 97,
        "nome": "FERREIRA DO ALENTEJO"
      }, {
        "id": 98,
        "nome": "FERREIRA DO ZÊZERE"
      }, {
        "id": 99,
        "nome": "FIGUEIRA DA FOZ"
      }, {
        "id": 100,
        "nome": "FIGUEIRA DE CASTELO RODRIGO"
      }, {
        "id": 101,
        "nome": "FIGUEIRÓ DOS VINHOS"
      }, {
        "id": 102,
        "nome": "FORNOS DE ALGODRES"
      }, {
        "id": 103,
        "nome": "FREIXO DE ESPADA À CINTA"
      }, {
        "id": 104,
        "nome": "FRONTEIRA"
      }, {
        "id": 105,
        "nome": "FUNCHAL"
      }, {
        "id": 106,
        "nome": "FUNDÃO"
      }, {
        "id": 107,
        "nome": "GAVIÃO"
      }, {
        "id": 108,
        "nome": "GÓIS"
      }, {
        "id": 109,
        "nome": "GOLEGÃ"
      }, {
        "id": 110,
        "nome": "GONDOMAR"
      }, {
        "id": 111,
        "nome": "GOUVEIA"
      }, {
        "id": 112,
        "nome": "GRÂNDOLA"
      }, {
        "id": 113,
        "nome": "GUARDA"
      }, {
        "id": 114,
        "nome": "GUIMARÃES"
      }, {
        "id": 115,
        "nome": "HORTA"
      }, {
        "id": 116,
        "nome": "IDANHA-A-NOVA"
      }, {
        "id": 117,
        "nome": "ÍLHAVO"
      }, {
        "id": 118,
        "nome": "LAGOA (FARO)"
      }, {
        "id": 119,
        "nome": "LAGOA"
      }, {
        "id": 120,
        "nome": "LAGOS"
      }, {
        "id": 121,
        "nome": "LAJES DAS FLORES"
      }, {
        "id": 122,
        "nome": "LAJES DO PICO"
      }, {
        "id": 123,
        "nome": "LAMEGO"
      }, {
        "id": 124,
        "nome": "LEIRIA"
      }, {
        "id": 125,
        "nome": "LISBOA"
      }, {
        "id": 126,
        "nome": "LOULÉ"
      }, {
        "id": 127,
        "nome": "LOURES"
      }, {
        "id": 128,
        "nome": "LOURINHÃ"
      }, {
        "id": 129,
        "nome": "LOUSÃ"
      }, {
        "id": 130,
        "nome": "LOUSADA"
      }, {
        "id": 131,
        "nome": "MAÇÃO"
      }, {
        "id": 132,
        "nome": "MACEDO DE CAVALEIROS"
      }, {
        "id": 133,
        "nome": "MACHICO"
      }, {
        "id": 134,
        "nome": "MADALENA"
      }, {
        "id": 135,
        "nome": "MAFRA"
      }, {
        "id": 136,
        "nome": "MAIA"
      }, {
        "id": 137,
        "nome": "MANGUALDE"
      }, {
        "id": 138,
        "nome": "MANTEIGAS"
      }, {
        "id": 139,
        "nome": "MARCO DE CANAVESES"
      }, {
        "id": 140,
        "nome": "MARINHA GRANDE"
      }, {
        "id": 141,
        "nome": "MARVÃO"
      }, {
        "id": 142,
        "nome": "MATOSINHOS"
      }, {
        "id": 143,
        "nome": "MEALHADA"
      }, {
        "id": 144,
        "nome": "MÊDA"
      }, {
        "id": 145,
        "nome": "MELGAÇO"
      }, {
        "id": 146,
        "nome": "MÉRTOLA"
      }, {
        "id": 147,
        "nome": "MESÃO FRIO"
      }, {
        "id": 148,
        "nome": "MIRA"
      }, {
        "id": 149,
        "nome": "MIRANDA DO CORVO"
      }, {
        "id": 150,
        "nome": "MIRANDA DO DOURO"
      }, {
        "id": 151,
        "nome": "MIRANDELA"
      }, {
        "id": 152,
        "nome": "MOGADOURO"
      }, {
        "id": 153,
        "nome": "MOIMENTA DA BEIRA"
      }, {
        "id": 154,
        "nome": "MOITA"
      }, {
        "id": 155,
        "nome": "MONÇÃO"
      }, {
        "id": 156,
        "nome": "MONCHIQUE"
      }, {
        "id": 157,
        "nome": "MONDIM DE BASTO"
      }, {
        "id": 158,
        "nome": "MONFORTE"
      }, {
        "id": 159,
        "nome": "MONTALEGRE"
      }, {
        "id": 160,
        "nome": "MONTEMOR-O-NOVO"
      }, {
        "id": 161,
        "nome": "MONTEMOR-O-VELHO"
      }, {
        "id": 162,
        "nome": "MONTIJO"
      }, {
        "id": 163,
        "nome": "MORA"
      }, {
        "id": 164,
        "nome": "MORTÁGUA"
      }, {
        "id": 165,
        "nome": "MOURA"
      }, {
        "id": 166,
        "nome": "MOURÃO"
      }, {
        "id": 167,
        "nome": "MURÇA"
      }, {
        "id": 168,
        "nome": "MURTOSA"
      }, {
        "id": 169,
        "nome": "NAZARÉ"
      }, {
        "id": 170,
        "nome": "NELAS"
      }, {
        "id": 171,
        "nome": "NISA"
      }, {
        "id": 172,
        "nome": "NORDESTE"
      }, {
        "id": 173,
        "nome": "ÓBIDOS"
      }, {
        "id": 174,
        "nome": "ODEMIRA"
      }, {
        "id": 175,
        "nome": "ODIVELAS"
      }, {
        "id": 176,
        "nome": "OEIRAS"
      }, {
        "id": 177,
        "nome": "OLEIROS"
      }, {
        "id": 178,
        "nome": "OLHÃO"
      }, {
        "id": 179,
        "nome": "OLIVEIRA DE AZEMÉIS"
      }, {
        "id": 180,
        "nome": "OLIVEIRA DE FRADES"
      }, {
        "id": 181,
        "nome": "OLIVEIRA DO BAIRRO"
      }, {
        "id": 182,
        "nome": "OLIVEIRA DO HOSPITAL"
      }, {
        "id": 183,
        "nome": "OURÉM"
      }, {
        "id": 184,
        "nome": "OURIQUE"
      }, {
        "id": 185,
        "nome": "OVAR"
      }, {
        "id": 186,
        "nome": "PAÇOS DE FERREIRA"
      }, {
        "id": 187,
        "nome": "PALMELA"
      }, {
        "id": 188,
        "nome": "PAMPILHOSA DA SERRA"
      }, {
        "id": 189,
        "nome": "PAREDES"
      }, {
        "id": 190,
        "nome": "PAREDES DE COURA"
      }, {
        "id": 191,
        "nome": "PEDRÓGÃO GRANDE"
      }, {
        "id": 192,
        "nome": "PENACOVA"
      }, {
        "id": 193,
        "nome": "PENAFIEL"
      }, {
        "id": 194,
        "nome": "PENALVA DO CASTELO"
      }, {
        "id": 195,
        "nome": "PENAMACOR"
      }, {
        "id": 196,
        "nome": "PENEDONO"
      }, {
        "id": 197,
        "nome": "PENELA"
      }, {
        "id": 198,
        "nome": "PENICHE"
      }, {
        "id": 199,
        "nome": "PESO DA RÉGUA"
      }, {
        "id": 200,
        "nome": "PINHEL"
      }, {
        "id": 201,
        "nome": "POMBAL"
      }, {
        "id": 202,
        "nome": "PONTA DELGADA"
      }, {
        "id": 203,
        "nome": "PONTA DO SOL"
      }, {
        "id": 204,
        "nome": "PONTE DA BARCA"
      }, {
        "id": 205,
        "nome": "PONTE DE LIMA"
      }, {
        "id": 206,
        "nome": "PONTE DE SOR"
      }, {
        "id": 207,
        "nome": "PORTALEGRE"
      }, {
        "id": 208,
        "nome": "PORTEL"
      }, {
        "id": 209,
        "nome": "PORTIMÃO"
      }, {
        "id": 210,
        "nome": "PORTO"
      }, {
        "id": 211,
        "nome": "PORTO DE MÓS"
      }, {
        "id": 212,
        "nome": "PORTO MONIZ"
      }, {
        "id": 213,
        "nome": "PORTO SANTO"
      }, {
        "id": 214,
        "nome": "PÓVOA DE LANHOSO"
      }, {
        "id": 215,
        "nome": "PÓVOA DE VARZIM"
      }, {
        "id": 216,
        "nome": "POVOAÇÃO"
      }, {
        "id": 217,
        "nome": "VILA DA PRAIA DA VITÓRIA"
      }, {
        "id": 218,
        "nome": "PROENÇA-A-NOVA"
      }, {
        "id": 219,
        "nome": "REDONDO"
      }, {
        "id": 220,
        "nome": "REGUENGOS DE MONSARAZ"
      }, {
        "id": 221,
        "nome": "RESENDE"
      }, {
        "id": 222,
        "nome": "RIBEIRA BRAVA"
      }, {
        "id": 223,
        "nome": "RIBEIRA DE PENA"
      }, {
        "id": 224,
        "nome": "RIBEIRA GRANDE"
      }, {
        "id": 225,
        "nome": "RIO MAIOR"
      }, {
        "id": 226,
        "nome": "SABROSA"
      }, {
        "id": 227,
        "nome": "SABUGAL"
      }, {
        "id": 228,
        "nome": "SALVATERRA DE MAGOS"
      }, {
        "id": 229,
        "nome": "SANTA COMBA DÃO"
      }, {
        "id": 230,
        "nome": "SANTA CRUZ"
      }, {
        "id": 231,
        "nome": "SANTA CRUZ DA GRACIOSA"
      }, {
        "id": 232,
        "nome": "SANTA CRUZ DAS FLORES"
      }, {
        "id": 233,
        "nome": "SANTA MARIA DA FEIRA"
      }, {
        "id": 234,
        "nome": "SANTA MARTA DE PENAGUIÃO"
      }, {
        "id": 235,
        "nome": "SANTANA"
      }, {
        "id": 236,
        "nome": "SANTARÉM"
      }, {
        "id": 237,
        "nome": "SANTIAGO DO CACÉM"
      }, {
        "id": 238,
        "nome": "SANTO TIRSO"
      }, {
        "id": 239,
        "nome": "SÃO BRÁS DE ALPORTEL"
      }, {
        "id": 240,
        "nome": "SÃO JOÃO DA MADEIRA"
      }, {
        "id": 241,
        "nome": "SÃO JOÃO DA PESQUEIRA"
      }, {
        "id": 242,
        "nome": "SÃO PEDRO DO SUL"
      }, {
        "id": 243,
        "nome": "SÃO ROQUE DO PICO"
      }, {
        "id": 244,
        "nome": "SÃO VICENTE"
      }, {
        "id": 245,
        "nome": "SARDOAL"
      }, {
        "id": 246,
        "nome": "SÁTÃO"
      }, {
        "id": 247,
        "nome": "SEIA"
      }, {
        "id": 248,
        "nome": "SEIXAL"
      }, {
        "id": 249,
        "nome": "SERNANCELHE"
      }, {
        "id": 250,
        "nome": "SERPA"
      }, {
        "id": 251,
        "nome": "SERTÃ"
      }, {
        "id": 252,
        "nome": "SESIMBRA"
      }, {
        "id": 253,
        "nome": "SETÚBAL"
      }, {
        "id": 254,
        "nome": "SEVER DO VOUGA"
      }, {
        "id": 255,
        "nome": "SILVES"
      }, {
        "id": 256,
        "nome": "SINES"
      }, {
        "id": 257,
        "nome": "SINTRA"
      }, {
        "id": 258,
        "nome": "SOBRAL DE MONTE AGRAÇO"
      }, {
        "id": 259,
        "nome": "SOURE"
      }, {
        "id": 260,
        "nome": "SOUSEL"
      }, {
        "id": 261,
        "nome": "TÁBUA"
      }, {
        "id": 262,
        "nome": "TABUAÇO"
      }, {
        "id": 263,
        "nome": "TAROUCA"
      }, {
        "id": 264,
        "nome": "TAVIRA"
      }, {
        "id": 265,
        "nome": "TERRAS DE BOURO"
      }, {
        "id": 266,
        "nome": "TOMAR"
      }, {
        "id": 267,
        "nome": "TONDELA"
      }, {
        "id": 268,
        "nome": "TORRE DE MONCORVO"
      }, {
        "id": 269,
        "nome": "TORRES NOVAS"
      }, {
        "id": 270,
        "nome": "TORRES VEDRAS"
      }, {
        "id": 271,
        "nome": "TRANCOSO"
      }, {
        "id": 272,
        "nome": "TROFA"
      }, {
        "id": 273,
        "nome": "VAGOS"
      }, {
        "id": 274,
        "nome": "VALE DE CAMBRA"
      }, {
        "id": 275,
        "nome": "VALENÇA"
      }, {
        "id": 276,
        "nome": "VALONGO"
      }, {
        "id": 277,
        "nome": "VALPAÇOS"
      }, {
        "id": 278,
        "nome": "VELAS"
      }, {
        "id": 279,
        "nome": "VENDAS NOVAS"
      }, {
        "id": 280,
        "nome": "VIANA DO ALENTEJO"
      }, {
        "id": 281,
        "nome": "VIANA DO CASTELO"
      }, {
        "id": 282,
        "nome": "VIDIGUEIRA"
      }, {
        "id": 283,
        "nome": "VIEIRA DO MINHO"
      }, {
        "id": 284,
        "nome": "VILA DE REI"
      }, {
        "id": 285,
        "nome": "VILA DO BISPO"
      }, {
        "id": 286,
        "nome": "VILA DO CONDE"
      }, {
        "id": 287,
        "nome": "VILA DO PORTO"
      }, {
        "id": 288,
        "nome": "VILA FLOR"
      }, {
        "id": 289,
        "nome": "VILA FRANCA DE XIRA"
      }, {
        "id": 290,
        "nome": "VILA FRANCA DO CAMPO"
      }, {
        "id": 291,
        "nome": "VILA NOVA DA BARQUINHA"
      }, {
        "id": 292,
        "nome": "VILA NOVA DE CERVEIRA"
      }, {
        "id": 293,
        "nome": "VILA NOVA DE FAMALICÃO"
      }, {
        "id": 294,
        "nome": "VILA NOVA DE FOZ CÔA"
      }, {
        "id": 295,
        "nome": "VILA NOVA DE GAIA"
      }, {
        "id": 296,
        "nome": "VILA NOVA DE PAIVA"
      }, {
        "id": 297,
        "nome": "VILA NOVA DE POIARES"
      }, {
        "id": 298,
        "nome": "VILA POUCA DE AGUIAR"
      }, {
        "id": 299,
        "nome": "VILA REAL"
      }, {
        "id": 300,
        "nome": "VILA REAL DE SANTO ANTÓNIO"
      }, {
        "id": 301,
        "nome": "VILA VELHA DE RÓDÃO"
      }, {
        "id": 302,
        "nome": "VILA VERDE"
      }, {
        "id": 303,
        "nome": "VILA VIÇOSA"
      }, {
        "id": 304,
        "nome": "VIMIOSO"
      }, {
        "id": 305,
        "nome": "VINHAIS"
      }, {
        "id": 306,
        "nome": "VISEU"
      }, {
        "id": 307,
        "nome": "VIZELA"
      }, {
        "id": 308,
        "nome": "VOUZELA"
      }]

    if (!localStorage.localidades) {
      localStorage.setItem("localidades", JSON.stringify(localidades));
    }

    // Testes
    if (!localStorage.testes) {
      this.testsController = new TestsController();
      this.testsController.AddTest("Serológico");
      this.testsController.AddTest("Antigénio");
      this.testsController.AddTest("RT-PCR");
    }

    // Utilizadores
    this.userController = new UserController();

    // Utilizadores normais
    if (!localStorage.utilizadores_normais) {
      // User 1: Geral
      this.userController.NormalUser_Register("Diogo", "Borges", "diogo@borges.pt", "123", "123456789", "001", new Date(), true);

      // User 2: Geral
      this.userController.NormalUser_Register("Gonçalo", "Gama", "goncalo@gama.pt", "123", "123456789", "003", new Date(), true);

      // User 3: Geral
      this.userController.NormalUser_Register("Diogo", "Oliveira", "diogo@oliveira.pt", "123", "123456789", "002", new Date(), false);

      // Transformar o user 1 em admin
      this.userController.ChangeUserType("goncalo@gama.pt", "admin");
    }

    if (!localStorage.enderecos_normal) {
      // User 2: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getNormalUserByEmail("goncalo@gama.pt").id, "Rua Nuno Álvares 87", "4420-024", 110, 41.14293268029151, -8.564717419708497, "Gondomar", true);

      // User 3: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getNormalUserByEmail("diogo@oliveira.pt").id, "Rua Oliveirinhas 98", "4420-330", 110, 41.140604, -8.525415799999999, "Gondomar", true);

      // User 1: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getNormalUserByEmail("diogo@borges.pt").id, "Rua da Âncora 100", "4400-297", 295, 37.080801, -8.307273199999999, "Gaia", true);
    }

    // Utilizadores entidades
    if (!localStorage.utilizadores_entidades) {
      this.userController.EntityUser_Register("Clínica da Venda Nova", "502747668", "vendanova@clinica.pt", "123", "vendanovaclinica.pt", "08:00", "20:00", "20", false, false, true);
      this.userController.EntityUser_Register("Centro Hospitalar Universitário de São João", null, "saojoao@hospital.pt", null, null, "08:00", "20:00", "20", false, false, false);
      this.userController.EntityUser_Register("Vale Saúde", "514987472", "valesaude@clinica.pt", "123", "valesaude.pt", "08:00", "20:00", "20", false, true, true);
      this.userController.EntityUser_Register("Unilabs Póvoa de Varzim", null, "povoavarzim@unilabs.pt", null, null, "10:00", "16:00", "5", true, false, false);
    }

    if (!localStorage.enderecos_entidade) {
      this.userController.EntityUser_RegisterAddress(this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, "R. da Ferraria 96", "4435-250", 110, 41.1749771, -8.5462703);
      this.userController.EntityUser_RegisterAddress(this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, "Alameda Prof. Hernâni Monteiro", "4200-319", 210, 41.18282823595165, -8.600261664418193);
      this.userController.EntityUser_RegisterAddress(this.userController.getEntityUserByEmail("valesaude@clinica.pt").id, "R. Dom João de Castro Nº 509", "4435-674", 110, 41.182707868135395, -8.5291363332414);
      this.userController.EntityUser_RegisterAddress(this.userController.getEntityUserByEmail("povoavarzim@unilabs.pt").id, "R. Dr. Leonardo Coimbra", "4490-621", 215, 41.3841745864648, -8.76049572402462);
    }

    if (!localStorage.testes_entidade) {
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, 1, "10", "00");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, 2, "7", "50");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, 3, "15", "99");

      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, 1, "5", "00");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, 2, "5", "00");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, 3, "5", "00");

      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("valesaude@clinica.pt").id, 1, "10", "99");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("valesaude@clinica.pt").id, 2, "15", "50");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("valesaude@clinica.pt").id, 3, "25", "99");

      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("povoavarzim@unilabs.pt").id, 2, "12", "50");
    }

    if (!localStorage.produtos) {
      this.loja = new LojaController();
      this.loja.ProdutoAdd("Mascara 50uni", "Mascara 50uni para proteção diaria contra virus", "6", "https://i.ibb.co/2Z2swPF/icon.png");
      this.loja.ProdutoAdd("Viseira", "Viseira de proteção", "3", "https://i.ibb.co/DfTRFKq/Face-Shield-Side-View-1024x791-2.png");
      this.loja.ProdutoAdd("Gel", "Viseira de proteção", "1", "https://i.ibb.co/Xx1rH4x/none-5677416728482b8c73d4e616499c7f02-5677416.jpg");
    }

    // Encomendas
    if (!localStorage.encomendas) {
      this.encomendasController = new EncomendasController();

      this.encomendasController.AddNewEncomenda(this.userController.getNormalUserByEmail("goncalo@gama.pt").id, new Date("2020-01-12"), 12.00, "Rua Nuno Álvares 87", "4420-024", "Gondomar", "Paypal", "123456789");
      this.encomendasController.AddNewEncomenda(this.userController.getNormalUserByEmail("goncalo@gama.pt").id, new Date("2020-01-12"), 12.00, "Rua Nuno Álvares 87", "4420-024", "Gondomar", "MBWay", "123456789");
    }

    // Detalhes encomenda
    if (!localStorage.detalhes_encomenda) {
      this.encomendasController = new EncomendasController();

      this.encomendasController.AddNewDetalhesEncomenda(1, 2, 1);
      this.encomendasController.AddNewDetalhesEncomenda(1, 1, 2);
      this.encomendasController.AddNewDetalhesEncomenda(2, 1, 2);
    }

    // Marcações
    this.marcacoesController = new MarcacoesController();
    if (!localStorage.marcacoes) {
      this.marcacoesController.AddNewMarcacao(
        this.userController.getNormalUserByEmail("diogo@borges.pt").id,
        this.userController.getEntityUserByEmail("vendanova@clinica.pt").id,
        new Date("2021-06-21T14:20:00"),
        1,
        false,
        "10.00"
      );
      this.marcacoesController.AddNewMarcacao(
        this.userController.getNormalUserByEmail("diogo@borges.pt").id,
        this.userController.getEntityUserByEmail("saojoao@hospital.pt").id,
        new Date("2021-06-12T08:20:00"),
        2,
        false,
        "7.50"
      );
      this.marcacoesController.AddNewMarcacao(
        this.userController.getNormalUserByEmail("goncalo@gama.pt").id,
        this.userController.getEntityUserByEmail("vendanova@clinica.pt").id,
        new Date("2021-06-12T22:23:00"),
        2,
        false,
        "7.50"
      );
    }

    // Classificações
    if (!localStorage.avaliacoes) {
      this.avaliacoesController = new AvaliacoesController();
      this.avaliacoesController.RegisterReview(this.userController.getNormalUserByEmail("diogo@oliveira.pt").id, this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, 1, 3, "meh...");
      this.avaliacoesController.RegisterReview(this.userController.getNormalUserByEmail("diogo@borges.pt").id, this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, 2, 4, "foi bom");
      this.avaliacoesController.RegisterReview(this.userController.getNormalUserByEmail("goncalo@gama.pt").id, this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, 3, 4, "bastante acessível");
    }

    this.gamificacoesController = new GamificacoesController();

    // Pontos
    if (!localStorage.pontos_encomenda) {
      this.gamificacoesController.AddPontosEncomenda(100);
    }

    // Pontos Avatar
    if (!localStorage.pontos_avatar) {
      this.gamificacoesController.AddPontosAvatar(50);
    }

    // Pontos Avaliação
    if (!localStorage.pontos_avaliacao) {
      this.gamificacoesController.AddPontosAvaliacao(200);
    }

    // Premio
    if (!localStorage.percentagem_premio) {
      this.gamificacoesController.AddPercentagemPremio(5, "1,2");
    }

    // Teste gratis
    if (!localStorage.quantidade_para_teste_gratis) {
      this.gamificacoesController.AddTesteGratis(5);
    }

    // Estados
    if (!localStorage.estados) {
      this.marcacoesController.AddEstado("Agendado");
      this.marcacoesController.AddEstado("Não disponível");
      this.marcacoesController.AddEstado("Resultado pendente");
      this.marcacoesController.AddEstado("Cancelado");
      this.marcacoesController.AddEstado("Terminado");
    }

    // Resultados
    if (!localStorage.resultados) {
      this.marcacoesController.AddResultado("Pendente");
      this.marcacoesController.AddResultado("Não disponível");
      this.marcacoesController.AddResultado("Positivo");
      this.marcacoesController.AddResultado("Negativo");
      this.marcacoesController.AddResultado("Inconclusivo");
    }
  }

  #instantiateViews() {
    const path = window.location.pathname;
    let route = path;

    try {
      route.split("//");
      route.split("\\");
      route = path.substr(path.lastIndexOf('/') + 1);
      if (route.indexOf(".") > -1) {
        route = route.split('.')[0];
      }
    } catch {
      route = "default";
    }
    const views = this.#getViews(route);
    for (const view of views) {
      if (view == IndexView) {
        this.indexInstance = new view();
      } else {
        new view();
      }
    }
  }

  #getViews(route) {
    return typeof this.routes[route] === 'undefined' ? [] : this.routes[route];
  }
}

const appInstance = new App();
export default appInstance.indexInstance;
