import React from 'react'
import Img from './helper/Img';
import Quote from './helper/Quote';
import List from './helper/List';
import Embed from './helper/Embed';

const BlogContent = ({block}) => {
    const { type, data } = block;

    if (type == 'paragraph') {
        return <p dangerouslySetInnerHTML={{__html: data.text}}></p>
    }
    else if (type == 'header') {
        if (data.level == 2) {
            return <h2 className='text-4xl font-bold' dangerouslySetInnerHTML={{__html: data.text}}></h2>
        }
        else if (data.level == 3) {
            return <h3 className='text-3xl font-bold' dangerouslySetInnerHTML={{ __html: data.text }}></h3>
        }
        else {
            return <h4 className='text-2xl font-bold font-inter' dangerouslySetInnerHTML={{__html: data.text}}></h4>
        }
    }
    else if (type == 'image') {
        return <Img url={data.file.url} caption={data.caption}/>
    }
    else if (type == 'quote') {
        return <Quote quote={data.text} caption={data.caption}/>
    }
    else if (type == 'list') {
        return <List style={data.style} items={data.items} />
    }
    else if (type == 'embed') {
        return <Embed url={data.embed} caption={data.caption}/>
    }
    else {
        return <p className='text-red bg-grey text-xl text-center rounded-md'>-- Can't generate this block of content --</p>
    }
}

export default BlogContent