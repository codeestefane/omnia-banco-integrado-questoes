'use client'

import ReactSelect, { components, DropdownIndicatorProps, StylesConfig} from 'react-select'
import './select.css'

type props = { nome: string; conteudo: string; opcoes: string[]; onChange?: (valor: string) => void; value?: string}

type Opcao = {
  value: string
  label: string
}

const TrianguloIndicator = (indicatorProps: DropdownIndicatorProps<Opcao, false>) => {
  return (
    <components.DropdownIndicator {...indicatorProps}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
        <polygon points="4,7 20,7 12,18" />
      </svg>
    </components.DropdownIndicator>
  )
}

export default function Select({ nome, conteudo, opcoes, onChange, value}: props) {
  const opcoesFormatadas: Opcao[] = opcoes.map((opcao) => ({
    value: opcao,
    label: opcao,
  }))

  const customStyles: StylesConfig<Opcao, false> = {
    control: (base, state) => ({
      ...base,
      borderRadius: '999px',
      borderColor: state.isFocused ? '#000000' : '#333333',
      backgroundColor: '#f3f4f6',
      boxShadow: 'none',
      padding: '2px 8px',
      cursor: 'pointer',
      '&:hover': {
        borderColor: '#000000',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'rgba(34, 127, 51, .6)' 
        : state.isFocused
        ? '#AFEABF' 
        : '#ffffff',
      color: '#000000',
      cursor: 'pointer',
    }),
    indicatorSeparator: () => ({
      display: 'none', 
    }),
  }

  return (
    <div className="select">
      <label htmlFor={nome}>{conteudo}:</label>
      <ReactSelect
        instanceId={nome}
        inputId={nome}
        name={nome}
        options={opcoesFormatadas}
        styles={customStyles}
        components={{ DropdownIndicator: TrianguloIndicator }}
        placeholder="Selecione..."
        isSearchable={false}
        onChange={(opcao) => onChange?.(opcao!.value)}
        required
        value={opcoesFormatadas.find((opcao) => opcao.value === value) ?? null}
      />
    </div>
  )
}