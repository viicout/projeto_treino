// exerciseDB.js — banco de exercícios simples
export function getExercises() {
  return {
    musculacao: {
      peito: [
        { name: "Supino reto", type: "compound" },
        { name: "Supino inclinado", type: "compound" },
        { name: "Crucifixo", type: "isolation" }
      ],
      costas: [
        { name: "Remada curvada", type: "compound" },
        { name: "Puxada alta", type: "compound" }
      ],
      pernas: [
        { name: "Agachamento livre", type: "compound" },
        { name: "Leg press", type: "compound" }
      ],
      ombro: [
        { name: "Desenvolvimento", type: "compound" },
        { name: "Elevação lateral", type: "isolation" }
      ],
      braco: [
        { name: "Rosca direta", type: "isolation" },
        { name: "Tríceps testa", type: "isolation" }
      ]
    },
    calistenia: {
      peito: [
        { name: "Flexão padrão", type: "compound" },
        { name: "Flexão diamante", type: "compound" }
      ],
      costas: [
        { name: "Barra fixa", type: "compound" },
        { name: "Australian pull-up", type: "compound" }
      ],
      pernas: [
        { name: "Agachamento corporal", type: "compound" },
        { name: "Saltos pliométricos", type: "compound" }
      ],
      ombro: [
        { name: "Pike push-up", type: "compound" },
        { name: "Handstand practice (progres.)", type: "compound" }
      ],
      braco: [
        { name: "Rows australianos", type: "compound" },
        { name: "Dips entre bancos", type: "compound" }
      ]
    },
    mobility: [
      "Rotação de ombro",
      "Cat-cow",
      "Círculos de quadril",
      "Mobilidade de tornozelo"
    ],
    warmups: [
      "Pular corda 3–5 min",
      "Corrida leve 5 min"
    ],
    stretching: [
      "Alongamento peitoral 30s/side",
      "Alongamento de isquiotibiais 30s/side"
    ]
  };
}
