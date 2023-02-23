import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../context/SocketContext';

export const BandList = () => {

    const [bands, setBands] = useState([]);
    const { socket } = useContext(SocketContext)

    // Escuchar cualquier cambio que el servidor emita en current-bands
    useEffect(() => {
        socket.on('current-bands', (bands) => {
            setBands(bands)
        })

        return () => socket.off('current-bands')

    }, [socket])

    const changeName = (event, id) => {
        const newName = event.target.value;
        setBands(bands => bands.map(band => {
            if (band.id === id) {
                band.name = newName;
            }
            return band;
        }))
    }

    const onPerdioFoco = (id, name) => {
        // TODO: Disparar el evento de sockets
        socket.emit('change-band-name', { id, name })
    }

    const voteBand = (id) => {
        socket.emit('votar-banda', id)
    }

    const deleteBand = (id) => {
        socket.emit('delete-band', id)
    }

    const crearRows = () => {
        return (
            bands.map(band => (
                <tr key={band.id}>
                    <td>
                        <button
                            className='btn btn-primary'
                            onClick={() => voteBand(band.id)}
                        >+1</button>
                    </td>
                    <td>
                        <input
                            className='form-control'
                            value={band.name}
                            onChange={(event) => changeName(event, band.id)}
                            onBlur={() => onPerdioFoco(band.id, band.name)}
                        />
                    </td>
                    <td><h3> {band.votes} </h3></td>
                    <td>
                        <button
                            className='btn btn-danger'
                            onClick={() => deleteBand(band.id)}
                        >Borrar</button>
                    </td>
                </tr>
            ))
        )
    };


    return (
        <>
            <table className='table table-stripped'>
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Botos</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {crearRows()}
                </tbody>
            </table>
        </>
    )
}
