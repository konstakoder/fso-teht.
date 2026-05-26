import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setSelected(null)
  }

  
const renderResults = () => {
  if (selected) {
    const c = selected
    return (
      <div>
        <h2>{c.name.common}</h2>
        <button onClick={() => setSelected(null)}>back</button>
        <p>Capital: {c.capital?.[0]}</p>
        <p>Area: {c.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(c.languages || {}).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img src={c.flags.png} alt={`flag of ${c.name.common}`} width={150} />
      </div>
    )
  }

  if (filtered.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (filtered.length > 1) {
    return (
      <ul>
        {filtered.map(country => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => setSelected(country)}>show</button>
          </li>
        ))}
      </ul>
    )
  }
  if (filtered.length === 1) {
    const c = filtered[0]
    return (
      <div>
        <h2>{c.name.common}</h2>
        <p>Capital: {c.capital?.[0]}</p>
        <p>Area: {c.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(c.languages || {}).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img src={c.flags.png} alt={`flag of ${c.name.common}`} width={150} />
      </div>
    )
  }
  return <p>No matches</p>
}

  return (
    <div>
      <p>find countries <input value={search} onChange={e => setSearch(e.target.value)} /></p>
      {renderResults()}
    </div>
  )
}

export default App