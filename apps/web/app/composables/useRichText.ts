export const useRichText = () => {
    const serialize = (nodes: any): string => {
        if (!nodes) return ''
        if (!Array.isArray(nodes)) {
            if (nodes.root && nodes.root.children) {
                return serialize(nodes.root.children)
            }
            return ''
        }

        return nodes.map((node: any) => {
            if (node.type === 'text') {
                let text = node.text ? node.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''

                // Simple format handling (Payload/Lexical uses bitmask)
                // 1: Bold, 2: Italic, 4: Strikethrough, 8: Underline, 16: Code, 32: Subscript, 64: Superscript
                if (node.format & 1) text = `<strong>${text}</strong>`
                if (node.format & 2) text = `<em>${text}</em>`
                if (node.format & 8) text = `<u>${text}</u>`
                if (node.format & 4) text = `<span class="line-through">${text}</span>`

                return text.replace(/\n/g, '<br>')
            }

            if (!node.children && !node.root) return ''

            const children = node.children ? serialize(node.children) : ''

            switch (node.type) {
                case 'paragraph':
                    return `<p class="mb-4 text-primary/80 leading-relaxed">${children}</p>`
                case 'heading':
                    const level = node.tag || 'h3'
                    const sizes: Record<string, string> = {
                        h1: 'text-3xl', h2: 'text-2xl', h3: 'text-xl', h4: 'text-lg', h5: 'text-base', h6: 'text-sm'
                    }
                    const size = sizes[level] || 'text-xl'
                    return `<${level} class="font-serif ${size} font-medium mb-3 mt-6 text-primary">${children}</${level}>`
                case 'list':
                    return node.listType === 'number'
                        ? `<ol class="list-decimal pl-5 mb-4 space-y-1">${children}</ol>`
                        : `<ul class="list-disc pl-5 mb-4 space-y-1">${children}</ul>`
                case 'listitem':
                    return `<li>${children}</li>`
                case 'quote':
                    return `<blockquote class="border-l-4 border-accent pl-4 italic my-4 opacity-80">${children}</blockquote>`
                case 'link':
                    const href = node.fields?.url || '#'
                    return `<a href="${href}" target="${node.fields?.newTab ? '_blank' : '_self'}" class="text-accent underline underline-offset-4 hover:text-primary transition-colors">${children}</a>`
                default:
                    return children
            }
        }).join('')
    }

    return { serialize }
}
