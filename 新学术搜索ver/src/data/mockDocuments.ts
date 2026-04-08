import { ParsedDocument } from '../types';

export const mockParsedDocuments: Record<string, ParsedDocument> = {
  '1': {
    paperId: '1',
    elements: [
      {
        id: 'elem-1',
        type: 'title',
        content: 'Attention Is All You Need',
      },
      {
        id: 'elem-2',
        type: 'author',
        content: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin',
      },
      {
        id: 'elem-3',
        type: 'heading',
        level: 1,
        content: 'Abstract',
      },
      {
        id: 'elem-4',
        type: 'paragraph',
        content: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.',
      },
      {
        id: 'elem-5',
        type: 'paragraph',
        content: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.',
      },
      {
        id: 'elem-6',
        type: 'heading',
        level: 1,
        content: '1. Introduction',
      },
      {
        id: 'elem-7',
        type: 'paragraph',
        content: 'Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation.',
      },
      {
        id: 'elem-8',
        type: 'paragraph',
        content: 'Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures. Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences.',
      },
      {
        id: 'elem-9',
        type: 'formula',
        content: 'Attention(Q, K, V) = softmax(QK^T / √d_k)V',
      },
      {
        id: 'elem-10',
        type: 'paragraph',
        content: 'In such models, however, attention mechanisms are used in conjunction with a recurrent network. In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.',
      },
      {
        id: 'elem-11',
        type: 'heading',
        level: 1,
        content: '2. Model Architecture',
      },
      {
        id: 'elem-12',
        type: 'paragraph',
        content: 'Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations to a sequence of continuous representations. Given these representations, the decoder then generates an output sequence of symbols one element at a time.',
      },
      {
        id: 'elem-13',
        type: 'image',
        content: '[Figure 1: The Transformer model architecture]',
        caption: 'Figure 1: The Transformer - model architecture',
      },
      {
        id: 'elem-14',
        type: 'paragraph',
        content: 'The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves of Figure 1, respectively.',
      },
      {
        id: 'elem-15',
        type: 'heading',
        level: 2,
        content: '2.1 Encoder and Decoder Stacks',
      },
      {
        id: 'elem-16',
        type: 'paragraph',
        content: 'Encoder: The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network.',
      },
      {
        id: 'elem-17',
        type: 'paragraph',
        content: 'We employ a residual connection around each of the two sub-layers, followed by layer normalization. That is, the output of each sub-layer is LayerNorm(x + Sublayer(x)), where Sublayer(x) is the function implemented by the sub-layer itself.',
      },
      {
        id: 'elem-18',
        type: 'paragraph',
        content: 'To facilitate these residual connections, all sub-layers in the model, as well as the embedding layers, produce outputs of dimension d_model = 512. Decoder: The decoder is also composed of a stack of N = 6 identical layers.',
      },
      {
        id: 'elem-19',
        type: 'paragraph',
        content: 'In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack. Similar to the encoder, we employ residual connections around each of the sub-layers, followed by layer normalization.',
      },
      {
        id: 'elem-20',
        type: 'heading',
        level: 2,
        content: '2.2 Attention',
      },
      {
        id: 'elem-21',
        type: 'paragraph',
        content: 'An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.',
      },
      {
        id: 'elem-22',
        type: 'heading',
        level: 3,
        content: '2.2.1 Scaled Dot-Product Attention',
      },
      {
        id: 'elem-23',
        type: 'paragraph',
        content: 'We call our particular attention "Scaled Dot-Product Attention". The input consists of queries and keys of dimension d_k, and values of dimension d_v. We compute the dot products of the query with all keys, divide each by sqrt(d_k), and apply a softmax function to obtain the weights on the values.',
      },
      {
        id: 'elem-24',
        type: 'paragraph',
        content: 'In practice, we compute the attention function on a set of queries simultaneously, packed together into a matrix Q. The keys and values are also packed together into matrices K and V. We compute the matrix of outputs as shown in the formula above.',
      },
      {
        id: 'elem-25',
        type: 'heading',
        level: 3,
        content: '2.2.2 Multi-Head Attention',
      },
      {
        id: 'elem-26',
        type: 'paragraph',
        content: 'Instead of performing a single attention function with d_model-dimensional keys, values and queries, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to d_k, d_k and d_v dimensions, respectively.',
      },
      {
        id: 'elem-27',
        type: 'paragraph',
        content: 'On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding d_v-dimensional output values. These are concatenated and once again projected, resulting in the final values.',
      },
      {
        id: 'elem-28',
        type: 'paragraph',
        content: 'Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.',
      },
      {
        id: 'elem-29',
        type: 'heading',
        level: 1,
        content: '3. Why Self-Attention',
      },
      {
        id: 'elem-30',
        type: 'paragraph',
        content: 'In this section we compare various aspects of self-attention layers to the recurrent and convolutional layers commonly used for mapping one variable-length sequence of symbol representations to another sequence of equal length.',
      },
      {
        id: 'elem-31',
        type: 'paragraph',
        content: 'Motivating our use of self-attention we consider three desiderata. One is the total computational complexity per layer. Another is the amount of computation that can be parallelized, as measured by the minimum number of sequential operations required.',
      },
      {
        id: 'elem-32',
        type: 'paragraph',
        content: 'The third is the path length between long-range dependencies in the network. Learning long-range dependencies is a key challenge in many sequence transduction tasks. One key factor affecting the ability to learn such dependencies is the length of the paths forward and backward signals have to traverse in the network.',
      },
      {
        id: 'elem-33',
        type: 'paragraph',
        content: 'The shorter these paths between any combination of positions in the input and output sequences, the easier it is to learn long-range dependencies. Hence we also compare the maximum path length between any two input and output positions in networks composed of the different layer types.',
      },
      {
        id: 'elem-34',
        type: 'heading',
        level: 1,
        content: '4. Training',
      },
      {
        id: 'elem-35',
        type: 'paragraph',
        content: 'This section describes the training regime for our models. We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37000 tokens.',
      },
      {
        id: 'elem-36',
        type: 'paragraph',
        content: 'For English-French, we used the significantly larger WMT 2014 English-French dataset consisting of 36M sentences and split tokens into a 32000 word-piece vocabulary. Sentence pairs were batched together by approximate sequence length.',
      },
      {
        id: 'elem-37',
        type: 'paragraph',
        content: 'Each training batch contained a set of sentence pairs containing approximately 25000 source tokens and 25000 target tokens. We used the Adam optimizer with specific parameter settings. We varied the learning rate over the course of training according to a specific formula.',
      },
      {
        id: 'elem-38',
        type: 'heading',
        level: 2,
        content: '4.1 Regularization',
      },
      {
        id: 'elem-39',
        type: 'paragraph',
        content: 'We employ three types of regularization during training. First, we apply dropout to the output of each sub-layer, before it is added to the sub-layer input and normalized. In addition, we apply dropout to the sums of the embeddings and the positional encodings in both the encoder and decoder stacks.',
      },
      {
        id: 'elem-40',
        type: 'paragraph',
        content: 'For the base model, we use a rate of P_drop = 0.1. During training, we also employ label smoothing of value epsilon_ls = 0.1. This hurts perplexity, as the model learns to be more unsure, but improves accuracy and BLEU score.',
      },
    ],
  },
};

// Mock translation function - simulates API call
export async function translateElement(element: any): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  const translations: Record<string, string> = {
    'Attention Is All You Need': '注意力机制就是你所需要的一切',
    'Abstract': '摘要',
    '1. Introduction': '1. 引言',
    '2. Model Architecture': '2. 模型架构',
    '2.1 Encoder and Decoder Stacks': '2.1 编码器和解码器堆叠',
    '2.2 Attention': '2.2 注意力机制',
    '2.2.1 Scaled Dot-Product Attention': '2.2.1 缩放点积注意力',
    '2.2.2 Multi-Head Attention': '2.2.2 多头注意力',
    '3. Why Self-Attention': '3. 为什么选择自注意力',
    '4. Training': '4. 训练',
    '4.1 Regularization': '4.1 正则化',
    'Figure 1: The Transformer - model architecture': '图1：Transformer 模型架构',
  };

  if (element.type === 'title' && translations[element.content]) {
    return translations[element.content];
  }
  
  if (element.type === 'heading' && translations[element.content]) {
    return translations[element.content];
  }

  if (element.type === 'image' && element.caption && translations[element.caption]) {
    return translations[element.caption];
  }

  // For paragraphs, return a mock Chinese translation
  if (element.type === 'paragraph') {
    const mockTranslations = [
      '主流的序列转换模型基于复杂的循环或卷积神经网络，包括编码器和解码器。性能最好的模型还通过注意力机制连接编码器和解码器。',
      '我们提出了一种新的简单网络架构 Transformer，完全基于注意力机制，完全摒弃了循环和卷积。在两个机器翻译任务上的实验表明，这些模型在质量上更优越，同时更易于并行化，训练时间显著减少。',
      '循环神经网络，特别是长短期记忆网络和门控循环神经网络，已被确立为序列建模和转换问题（如语言建模和机器翻译）中的最先进方法。',
      '此后，许多努力继续推动循环语言模型和编码器-解码器架构的边界。注意力机制已成为各种任务中引人注目的序列建模和转换模型的组成部分，允许对依赖关系进行建模，而不考虑它们在输入或输出序列中的距离。',
      '然而，在这些模型中，注意力机制与循环网络结合使用。在这项工作中，我们提出了 Transformer，这是一种避免循环的模型架构，而是完全依赖注意力机制来绘制输入和输出之间的全局依赖关系。',
      '大多数有竞争力的神经序列转换模型都具有编码器-解码器结构。在这里，编码器将符号表示的输入序列映射到连续表示序列。给定这些表示，解码器然后一次生成一个元素的符号输出序列。',
      'Transformer 遵循这种整体架构，对编码器和解码器使用堆叠的自注意力和逐点全连接层，分别显示在图1的左半部分和右半部分。',
      '编码器：编码器由 N = 6 个相同层的堆叠组成。每一层都有两个子层。第一个是多头自注意力机制，第二个是简单的位置全连接前馈网络。',
      '我们在每个子层周围采用残差连接，然后进行层归一化。也就是说，每个子层的输出是 LayerNorm(x + Sublayer(x))，其中 Sublayer(x) 是子层本身实现的函数。',
      '为了便于这些残差连接，模型中的所有子层以及嵌入层都产生维度为 d_model = 512 的输出。解码器：解码器也由 N = 6 个相同层的堆叠组成。',
      '除了每个编码器层中的两个子层外，解码器还插入了第三个子层，该子层对编码器堆栈的输出执行多头注意力。与编码器类似，我们在每个子层周围采用残差连接，然后进行层归一化。',
      '注意力函数可以描述为将查询和一组键值对映射到输出，其中查询、键、值和输出都是向量。输出计算为值的加权和，其中分配给每个值的权重是通过查询与相应键的兼容性函数计算的。',
      '我们将我们的特定注意力称为"缩放点积注意力"。输入由维度为 d_k 的查询和键以及维度为 d_v 的值组成。我们计算查询与所有键的点积，将每个除以 sqrt(d_k)，然后应用 softmax 函数以获得值的权重。',
      '在实践中，我们同时对一组查询计算注意力函数，将它们打包成矩阵 Q。键和值也打包成矩阵 K 和 V。我们计算输出矩阵，如上面的公式所示。',
      '我们发现，与使用 d_model 维键、值和查询执行单个注意力函数相比，将查询、键和值分别线性投影 h 次到 d_k、d_k 和 d_v 维度是有益的，这些投影是不同的、学习到的线性投影。',
      '然后，我们对这些投影版本的查询、键和值并行执行注意力函数，产生 d_v 维输出值。这些被连接起来并再次投影，得到最终值。',
      '多头注意力允许模型在不同位置共同关注来自不同表示子空间的信息。使用单个注意力头，平均会抑制这一点。',
      '在本节中，我们将自注意力层的各个方面与通常用于将一个可变长度的符号表示序列映射到另一个等长序列的循环层和卷积层进行比较。',
      '为了激励我们使用自注意力，我们考虑三个需求。一个是每层的总计算复杂度。另一个是可以并行化的计算量，由所需的最小顺序操作数来衡量。',
      '第三个是网络中长程依赖关系之间的路径长度。学习长程依赖关系是许多序列转换任务中的关键挑战。影响学习此类依赖关系能力的一个关键因素是前向和后向信号必须在网络中遍历的路径长度。',
      '输入和输出序列中任何位置组合之间的路径越短，学习长程依赖关系就越容易。因此，我们还比较了由不同层类型组成的网络中任意两个输入和输出位置之间的最大路径长度。',
      '本节描述了我们模型的训练方案。我们在标准的 WMT 2014 英德数据集上进行训练，该数据集包含约 450 万个句子对。句子使用字节对编码进行编码，具有约 37000 个标记的共享源-目标词汇表。',
      '对于英法翻译，我们使用了更大的 WMT 2014 英法数据集，包含 3600 万个句子，并将标记拆分为 32000 个词片词汇表。句子对按近似序列长度批处理在一起。',
      '每个训练批次包含一组句子对，包含大约 25000 个源标记和 25000 个目标标记。我们使用具有特定参数设置的 Adam 优化器。我们根据特定公式在训练过程中改变学习率。',
      '我们在训练期间采用三种类型的正则化。首先，我们对每个子层的输出应用 dropout，然后将其添加到子层输入并进行归一化。此外，我们对编码器和解码器堆栈中的嵌入和位置编码的总和应用 dropout。',
      '对于基本模型，我们使用 P_drop = 0.1 的比率。在训练期间，我们还采用值为 epsilon_ls = 0.1 的标签平滑。这会损害困惑度，因为模型学会更加不确定，但会提高准确性和 BLEU 分数。',
    ];
    
    const index = parseInt(element.id.split('-')[1]) % mockTranslations.length;
    return mockTranslations[index];
  }

  return element.content;
}
