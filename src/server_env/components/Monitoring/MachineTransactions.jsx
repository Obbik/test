import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'

export default ({ transactions }) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <div className="overflow-auto">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center" style={{ width: 50 }}>
              #
            </th>
            <th>{TRL_Pack.transactions.status}</th>
            <th className="text-center">{TRL_Pack.transactions.payment}</th>
            <th>{TRL_Pack.transactions.cost}</th>
            <th>{TRL_Pack.transactions.date}</th>
            <th>{TRL_Pack.transactions.shelf}</th>
            <th>{TRL_Pack.transactions.ean}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(
            transactions.reduce((r, a) => {
              r[a.id] = r[a.id] || []
              r[a.id].push(a)
              return r
            }, Object.create(null))
          ).map((trx, idx) => (
            <tr key={idx}>
              {trx.length === 1 ? (
                <>
                  <td className="font-weight-bold text-center">{idx + 1}</td>
                  <td
                    className="font-weight-bold"
                    style={{
                      color:
                        trx[0].status === 'Product received'
                          ? 'green'
                          : trx[0].status === 'Vend failure'
                          ? 'red'
                          : 'orange'
                    }}
                  >
                    {trx[0].status}
                  </td>
                  <td className="text-center">
                    {trx[0].payment_type === 'Cashless_Terminal' ? (
                      <i className="fas fa-credit-card" />
                    ) : trx[0].payment_type === 'Coin_Acceptor' ? (
                      <i className="fas fa-coins"></i>
                    ) : trx[0].payment_type === 'BLIK' ? (
                      <i className="fab fa-paypal" />
                    ) : (
                      trx[0].payment_type === 'Cashless_Token' && (
                        <i className="fab fa-bitcoin" />
                      )
                    )}
                  </td>
                  <td className="font-weight-bolder">{trx[0].price.toFixed(2)} zł</td>
                  <td className="font-weight-bolder">{trx[0].create_date_time}</td>
                  <td className="font-weight-bolder">{trx[0].machine_feeder_no}</td>
                  <td className="font-weight-bolder">
                    <span title={trx[0].product_name}>{trx[0].ean}</span>
                  </td>
                </>
              ) : (
                <>
                  <td className="font-weight-bold text-center">{idx + 1}</td>
                  <td className="font-weight-bold">
                    {trx
                      .map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            color:
                              t.status === 'Product received'
                                ? 'green'
                                : t.status === 'Vend failure'
                                ? 'red'
                                : 'orange'
                          }}
                        >
                          {t.status}
                        </span>
                      ))
                      .reduce((prev, curr) => [
                        prev,
                        <span key={idx + 50} className="d-block" style={{ height: 5 }} />,
                        curr
                      ])}
                  </td>
                  <td className="text-center">
                    {trx[0].payment_type === 'Cashless_Terminal' ? (
                      <i className="fas fa-credit-card" />
                    ) : trx[0].payment_type === 'Coin_Acceptor' ? (
                      <i className="fas fa-coins"></i>
                    ) : trx[0].payment_type === 'BLIK' ? (
                      <i className="fab fa-paypal" />
                    ) : (
                      trx[0].payment_type === 'Cashless_Token' && (
                        <i className="fab fa-bitcoin" />
                      )
                    )}
                  </td>
                  <td className="font-weight-bolder">
                    {trx
                      .map((t, idx) => `${t.price.toFixed(2)} zł`)
                      .reduce((prev, curr) => [
                        prev,
                        <span key={idx} className="d-block" style={{ height: 5 }} />,
                        curr
                      ])}
                  </td>
                  <td className="font-weight-bolder">{trx[0].create_date_time}</td>
                  <td className="font-weight-bolder">
                    {trx
                      .map((t, idx) => t.machine_feeder_no)
                      .reduce((prev, curr) => [
                        prev,
                        <span key={idx} className="d-block" style={{ height: 5 }} />,
                        curr
                      ])}
                  </td>
                  <td className="font-weight-bolder">
                    {trx
                      .map((t, idx) => <span title={t.product_name}>{t.ean}</span>)
                      .reduce((prev, curr) => [
                        prev,
                        <span key={idx} className="d-block" style={{ height: 5 }} />,
                        curr
                      ])}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
