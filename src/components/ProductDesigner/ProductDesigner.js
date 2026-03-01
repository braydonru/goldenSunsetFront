import { useState } from 'react'
import DesignerCanvas from './CanvasDesigner'
import './designer.css'

export default function PulloverDesigner() {
    const [image, setImage] = useState(null)
    const [text, setText] = useState('')

    return (
        <div className="designer-layout">
            <DesignerCanvas image={image} text={text} />

            <div className="panel">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => setImage(reader.result)
                        reader.readAsDataURL(file)
                    }}
                />

                <input
                    type="text"
                    placeholder="Add text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button
                    onClick={() => {
                        const canvas = document.querySelector('canvas')
                        const link = document.createElement('a')
                        link.download = 'design.png'
                        link.href = canvas.toDataURL()
                        link.click()
                    }}
                >
                    Export design
                </button>
            </div>
        </div>
    )
}
