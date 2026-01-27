import React from 'react'

interface RichTextProps {
  content: any
  className?: string
}

export const RichText: React.FC<RichTextProps> = ({ content, className }) => {
  if (!content) return null

  // Pour l'instant, on gère le cas où c'est déjà du HTML (fallback)
  if (typeof content === 'string') {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    )
  }

  // Si c'est du Lexical (JSON)
  // Une version très simplifiée du sérialiseur
  const serialize = (nodes: any[]): React.ReactNode[] => {
    return nodes.map((node, i) => {
      if (node.type === 'text') {
        let text = <span key={i}>{node.text}</span>
        if (node.format & 1) text = <strong key={i}>{text}</strong>
        if (node.format & 2) text = <em key={i}>{text}</em>
        return text
      }

      if (!node) return null

      const children = node.children ? serialize(node.children) : []

      switch (node.type) {
        case 'h1': return <h1 key={i}>{children}</h1>
        case 'h2': return <h2 key={i}>{children}</h2>
        case 'h3': return <h3 key={i}>{children}</h3>
        case 'p': return <p key={i}>{children}</p>
        case 'list':
          return node.listType === 'number' 
            ? <ol key={i} className="list-decimal pl-6">{children}</ol>
            : <ul key={i} className="list-disc pl-6">{children}</ul>
        case 'listitem': return <li key={i}>{children}</li>
        default: return <div key={i}>{children}</div>
      }
    })
  }

  return (
    <div className={className}>
      {content.root?.children ? serialize(content.root.children) : null}
    </div>
  )
}
