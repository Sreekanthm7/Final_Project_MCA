import React, { useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

interface Story {
  id: string
  title: string
  summary: string
  body: string
  readTime: string
}

interface StoryTheme {
  id: string
  title: string
  description: string
  icon: any
  colors: readonly [string, string, ...string[]]
  stories: Story[]
}

const STORY_THEMES: StoryTheme[] = [
  {
    id: "friendship",
    title: "Friendship",
    description: "Heartwarming tales of companionship",
    icon: "people",
    colors: ["#667eea", "#764ba2"] as const,
    stories: [
      {
        id: "f1",
        title: "The Two Pots",
        summary: "Two very different pots discover the strength in their differences.",
        readTime: "3 min",
        body: `A water-bearer carried two pots on a pole across his shoulders every day. One pot was perfect and always delivered a full portion of water. The other had a crack and arrived only half full.

The perfect pot was proud of its accomplishment. But the cracked pot was ashamed of its imperfection and miserable that it could only do half of what it was made to do.

After two years of what it perceived as bitter failure, the cracked pot spoke to the water-bearer one day by the stream.

"I am ashamed of myself, because this crack in my side causes water to leak out all the way back to your house."

The water-bearer smiled and said, "Did you notice that there are flowers on your side of the path, but not on the other pot's side? I have always known about your flaw, so I planted flower seeds on your side of the path. Every day while we walk back, you water them. For two years I have been able to pick these beautiful flowers to decorate my table. Without you being just the way you are, there would not be this beauty to grace our home."

Each of us has our own unique flaws. But it is the cracks and flaws we each have that make our lives together so very interesting and rewarding. We must take each person for what they are and look for the good in them.`,
      },
      {
        id: "f2",
        title: "The Blind Man and the Lame Man",
        summary: "Two strangers discover that together they can do what neither could alone.",
        readTime: "3 min",
        body: `In a small village, there lived a blind man and a lame man. They were neighbors but had never spoken, each too proud to admit they needed help.

One autumn, a terrible storm destroyed the bridge that connected their village to the market town. Without food supplies, the village would starve before winter.

The blind man was strong and could walk for miles, but he could not see the path through the forest. The lame man had sharp eyes and knew every trail, but his legs could not carry him.

For two days they each sat alone, frustrated and hungry. Then the blind man heard the lame man muttering about the forest path he could see from his window.

"You can see the way?" the blind man called out.

"Every stone and every turn," the lame man replied. "But my legs are useless."

A long silence passed. Then the blind man walked to the lame man's door and knelt down. "Climb on my shoulders. You be my eyes, and I will be your legs."

And so they went — the lame man sitting on the blind man's strong shoulders, calling out directions through the forest. They reached the market, brought back food, and saved their village.

From that day on, they were inseparable friends. The blind man never stumbled, and the lame man never stayed behind. What neither could do alone, together they did with ease.

Sometimes the greatest friendships are born when we stop pretending we don't need each other.`,
      },
      {
        id: "f3",
        title: "The Old Man and the Sparrow",
        summary: "A lonely man finds an unexpected friend on his windowsill.",
        readTime: "4 min",
        body: `Mr. Thomas had lived alone since his wife passed away three years ago. His children lived in distant cities, and his neighbors were polite but busy. Most days, the only voice he heard was the television.

One cold February morning, he noticed a small sparrow sitting on his kitchen windowsill. The bird was shivering, its feathers puffed out against the cold. Without thinking, Mr. Thomas crumbled a piece of toast and placed it on the ledge.

The sparrow ate eagerly and flew away.

The next morning, the sparrow returned. And the next. And the next. Soon Mr. Thomas found himself waking up with purpose — he would prepare a small dish of seeds and crumbs and wait by the window.

By March, the sparrow would tap on the glass with its beak if Mr. Thomas was late. He laughed for the first time in months.

"You're more punctual than my old boss," he told the bird.

By April, the sparrow brought a friend. By May, there were six birds visiting his windowsill each morning. Mr. Thomas bought a proper bird feeder and a book about local birds.

One afternoon, his neighbor Mrs. Chen noticed the birds and knocked on his door.

"What a lovely garden you're creating!" she said. They talked about birds for an hour. She came back the next day with her own bag of seeds.

Soon other neighbors joined. Someone brought a bench. Someone else planted flowers. What started with one cold sparrow became a small garden where the whole street gathered on weekend mornings.

At his eightieth birthday, surrounded by neighbors and friends, Mr. Thomas raised his cup of tea and said, "All of this because a little bird was hungry."

Sometimes the smallest creatures teach us the biggest lessons: that reaching out, even in the simplest way, can change everything.`,
      },
    ],
  },
  {
    id: "nature",
    title: "Nature",
    description: "Beautiful stories from the natural world",
    icon: "leaf",
    colors: ["#43e97b", "#38f9d7"] as const,
    stories: [
      {
        id: "n1",
        title: "The Bamboo and the Fern",
        summary: "A gardener learns patience from two very different plants.",
        readTime: "3 min",
        body: `A young man went to his grandfather's garden, frustrated that nothing in his life seemed to be going right.

His grandfather handed him a fern seed and a bamboo seed. "Plant them both," he said. "Water them every day and watch."

The fern sprouted quickly. Within weeks, it was lush and green, spreading its delicate fronds in the sunlight. The young man smiled at the fern, then looked at the bamboo patch — nothing. Just bare soil.

He watered both faithfully. After a year, the fern was tall and beautiful. The bamboo plot was still empty.

Two years passed. Three years. Four years. The fern flourished. The bamboo showed nothing. The young man wanted to give up on the bamboo.

"Keep watering," his grandfather said gently.

In the fifth year, a tiny bamboo shoot broke through the earth. And then, in just six weeks, it grew ninety feet tall — towering over the fern, over the garden wall, over the rooftop.

The young man stared in amazement. "How?"

His grandfather smiled. "For five years, the bamboo was growing roots — deep, strong roots spreading underground where you couldn't see them. Without those five years of invisible growth, it could never have supported the height it reached."

He put his hand on his grandson's shoulder. "Every day you felt nothing was happening, something was growing inside you. The roots come first. The height will follow."

Nature never hurries. Yet everything is accomplished. The bamboo knows this. And now, so do you.`,
      },
      {
        id: "n2",
        title: "The Oak and the Reed",
        summary: "A mighty oak and a humble reed face a powerful storm.",
        readTime: "3 min",
        body: `At the edge of a wide river stood a magnificent oak tree. Its trunk was thick, its branches spread wide, and its roots gripped the earth like iron. It had stood there for a hundred years, proud and unyielding.

At the oak's feet grew a cluster of slender reeds — thin, delicate, bending with every breeze that passed.

The oak looked down at the reeds one calm evening and said, "How pitiful you are. The slightest wind makes you bow and sway. You have no strength, no dignity. Look at me — I stand firm against every gale."

The reeds said nothing. They simply swayed in the evening breeze.

That night, a terrible storm swept across the land. Thunder shook the ground. Wind howled with a fury no one had seen in decades. Rain fell in sheets.

The oak stood rigid against the storm, refusing to bend even an inch. It fought the wind with all its might, its thick branches pushing back against every gust. But the wind grew stronger. With a tremendous crack, the oak's trunk split. Its roots tore from the earth, and the great tree crashed to the ground.

When morning came and the skies cleared, the reeds stood up gently, shook the raindrops from their leaves, and swayed peacefully in the soft morning breeze. They were untouched.

A farmer walking by looked at the fallen oak and the standing reeds and nodded to himself.

"The tree that does not bend," he murmured, "breaks."

Flexibility is not weakness. Sometimes the wisest thing we can do is bend with life's storms rather than fight them — and be standing when the sun comes out again.`,
      },
      {
        id: "n3",
        title: "The River That Found the Sea",
        summary: "A mountain stream learns that its journey has a beautiful purpose.",
        readTime: "3 min",
        body: `High in the mountains, a small spring bubbled up between two rocks. The water was clear and cold, and it began to flow downhill — not knowing where it was going, only that it must move.

At first, the stream was tiny. It trickled over pebbles and slipped between mossy stones. It was so small that a child could step over it.

"Where am I going?" the stream wondered. "I am so small. What difference could I possibly make?"

But it kept flowing.

As it traveled down the mountain, other small streams joined it. The trickle became a brook. The brook became a creek. The creek became a river.

Along the way, the river watered meadows where wildflowers bloomed. It gave drink to deer and rabbits. Children played on its banks. Farmers used its water to grow their crops. Villages were built beside it.

Still, the river did not know where it was going. It only knew it must keep flowing.

One day, the river reached a vast, open plain. The land was flat, and the river slowed down, spreading wide and shallow. It felt tired and lost.

"Perhaps this is where I end," the river thought sadly.

But then it heard something — a deep, rhythmic roar. The river flowed toward the sound, and suddenly the land fell away, and there before it was the ocean — endless, blue, and shimmering under the sun.

The river poured itself into the sea, and in that moment, it understood. Every twist and turn, every rock it had gone around, every meadow it had nourished — it had all been leading here.

The small spring from the mountain had become part of something infinite.

Your journey matters, even when you cannot see the destination. Keep flowing.`,
      },
    ],
  },
  {
    id: "family",
    title: "Family",
    description: "Touching stories about family bonds",
    icon: "home",
    colors: ["#f093fb", "#f5576c"] as const,
    stories: [
      {
        id: "fa1",
        title: "Grandmother's Hands",
        summary: "A granddaughter discovers the story behind her grandmother's worn hands.",
        readTime: "4 min",
        body: `Little Meera was sitting on the porch with her grandmother when she noticed something. She reached out and held her grandmother's hand, tracing the wrinkles and spots with her small finger.

"Grandma, why are your hands so different from mine?" she asked.

Her grandmother smiled and closed her fingers gently around Meera's tiny hand.

"These hands have a story, child," she said.

"These hands kneaded dough every morning for forty years to feed my family. Feel these calluses? They came from grinding spices on the stone mortar your grandfather carved for me as a wedding gift."

She turned her hand over.

"This scar is from the time I burned myself making sweets for your father's first birthday. I was so nervous — my first child, my first birthday celebration. The sweets turned out perfectly."

She touched a faded mark near her wrist.

"This one is from pruning the rose garden. Your grandfather loved roses. After he passed, I kept the garden alive because every bloom reminded me of him."

She flexed her fingers slowly.

"These hands held your father when he was born. They held your mother's hand on her wedding day. And they held you the very first day you came into this world — you were so tiny, and you wrapped your whole hand around just one of my fingers."

Meera looked at her own smooth, small hands, then back at her grandmother's.

"Your hands are more beautiful than mine, Grandma," she said quietly.

Her grandmother's eyes glistened. She kissed the top of Meera's head.

"One day, your hands will have their own stories to tell. And they will be just as beautiful."

The most beautiful hands in the world are not smooth and perfect. They are the ones that have loved, worked, held, and healed — hands that tell the story of a life well lived.`,
      },
      {
        id: "fa2",
        title: "The Wooden Bowl",
        summary: "A small boy teaches his parents an unforgettable lesson.",
        readTime: "3 min",
        body: `An old man had moved in with his son, daughter-in-law, and their four-year-old grandson. The old man's hands trembled, his eyesight was blurred, and his step faltered.

The family ate together at the table every evening. But the grandfather's shaky hands and failing sight made eating difficult. Peas rolled off his spoon onto the floor. When he grasped his glass, milk spilled on the tablecloth.

The son and daughter-in-law became irritated with the mess. "We must do something about Grandfather," the son said.

So they set a small table in the corner. There, the grandfather ate alone while the rest of the family enjoyed dinner at the main table. Since the grandfather had broken a dish or two, his food was served in a simple wooden bowl.

Sometimes when the family glanced at the grandfather, he had a tear in his eye as he sat alone. Still, the only words the couple had for him were sharp admonitions when he dropped a fork or spilled food.

The four-year-old watched everything in silence.

One evening before supper, the father noticed his son playing with wood scraps on the floor. He asked the child sweetly, "What are you making?"

The boy answered just as sweetly, "Oh, I am making a little wooden bowl for you and Mama to eat your food in when I grow up."

The four-year-old smiled and went back to work.

The words struck the parents so deeply that they were speechless. Then tears started to stream down their cheeks. Though no word was spoken, both knew what must be done.

That evening, the grandfather was brought back to the family table. He ate with the family from a proper plate, and no one seemed to care when a fork was dropped, food spilled, or the tablecloth was soiled.

Children are remarkably perceptive. Their eyes ever observe, their ears ever listen, and their minds ever process the messages they absorb. The way we treat our elders tells our children how we will one day be treated.`,
      },
      {
        id: "fa3",
        title: "The Quilt of Memories",
        summary: "A family discovers that love is stitched into the fabric of everyday life.",
        readTime: "4 min",
        body: `When Grandma Leela passed away at ninety-two, her family gathered at her old house to sort through her belongings. In her bedroom closet, they found a large, folded quilt they had never seen before.

They spread it on the bed. It was enormous — made of dozens of fabric squares in every color and pattern imaginable. Some squares were silk, some cotton, some faded, some bright.

"What is this?" asked her eldest son, Ravi.

Her daughter Priya looked closer and gasped. "This square — this is from my school uniform! I remember this fabric."

Ravi touched another square. "And this — this was Father's old shirt. The blue one he wore every Sunday."

One by one, the family recognized the fabrics. A piece of a baby blanket. A scrap from a wedding sari. Fabric from kitchen curtains that had hung in three different houses. A square cut from a child's Halloween costume. A piece of the tablecloth from their first family dinner in their new home.

Tucked into the quilt's corner was a small note in Grandma Leela's shaky handwriting:

"This quilt holds a piece of every happy day I can remember. Every time something beautiful happened in our family, I saved a scrap of fabric from that day. I have been making this quilt for sixty years.

When you wrap yourselves in it, know that you are wrapped in every birthday, every holiday, every ordinary Tuesday morning when I looked at my family and felt my heart overflow.

This is not just a quilt. It is the story of us."

The family sat in silence, tears falling freely, running their fingers over squares of fabric that held sixty years of love.

That quilt was never put away. It was draped over the sofa in Ravi's living room, where grandchildren climbed under it on movie nights, and great-grandchildren napped beneath it on Sunday afternoons.

Love doesn't disappear when someone leaves us. It lives on in the things they touched, the traditions they started, and the memories they stitched together, one ordinary day at a time.`,
      },
    ],
  },
  {
    id: "wisdom",
    title: "Wisdom",
    description: "Inspiring tales of life lessons",
    icon: "bulb",
    colors: ["#4facfe", "#00f2fe"] as const,
    stories: [
      {
        id: "w1",
        title: "The Jar of Life",
        summary: "A professor teaches his students what truly matters.",
        readTime: "3 min",
        body: `A philosophy professor stood before his class with a large empty glass jar. Without saying a word, he filled the jar with golf balls and asked the students if the jar was full. They agreed it was.

He then picked up a box of small pebbles and poured them into the jar. The pebbles rolled into the open areas between the golf balls. He asked again if the jar was full. The students laughed and agreed it was.

He next picked up a box of sand and poured it into the jar. The sand filled up the remaining spaces. He asked once more if the jar was full. The students responded with a unanimous "yes."

The professor then took out two cups of tea from under the table and poured the tea into the jar, filling the empty space between the sand. The students laughed.

"Now," said the professor, "I want you to recognize that this jar represents your life.

The golf balls are the important things — your family, your health, your friends, your passions — the things that, even if everything else was lost, your life would still feel full.

The pebbles are the other things that matter — your job, your house, your car.

The sand is everything else — the small stuff, the worries, the trivial complaints.

If you put the sand into the jar first, there is no room for the pebbles or the golf balls. The same goes for life. If you spend all your time and energy on the small stuff, you will never have room for the things that are truly important.

Pay attention to the things that matter most. Spend time with your family. Take care of your health. Go for a walk with an old friend. There will always be time to clean the house and run errands.

Take care of the golf balls first — the things that really matter. Set your priorities. The rest is just sand."

One student raised her hand and asked what the tea represented.

The professor smiled. "No matter how full your life may seem, there's always room for a cup of tea with a friend."`,
      },
      {
        id: "w2",
        title: "The Carpenter's House",
        summary: "A retiring carpenter builds one final house and learns his last lesson.",
        readTime: "3 min",
        body: `An elderly carpenter was ready to retire. He told his employer of his plans to leave the house-building business and live a more leisurely life with his wife. He would miss the paycheck, but he wanted to retire. They could get by.

The employer was sorry to see his good worker go and asked if he could build just one more house as a personal favor. The carpenter said yes, but over time it was easy to see that his heart was not in his work. He used cheap materials and cut corners wherever he could. It was an unfortunate way to end a dedicated career.

When the carpenter finished his work, his employer came to inspect the house. Then he handed the front door key to the carpenter.

"This is your house," the employer said. "It is my gift to you."

The carpenter was shocked. What a shame! If he had only known he was building his own house, he would have done it all so differently.

So it is with us. We build our lives, a day at a time, often putting less than our best into the building. Then, with a shock, we realize we have to live in the house we have built.

If we could do it over, we would do it much differently. But we cannot go back.

You are the carpenter of your life. Each day you hammer a nail, place a board, or put up a wall. Your attitudes and the choices you make today are building the "house" you will live in tomorrow.

Build wisely. Build with care. Even if you have only one more day to build, make it the best day's work you have ever done.

It is the only life you will ever build. Even if you live it for only one more day, that day deserves to be lived graciously and with dignity.`,
      },
      {
        id: "w3",
        title: "The Cracked Pot's Garden",
        summary: "An old potter finds beauty in what others call broken.",
        readTime: "3 min",
        body: `In a village in Japan, there lived an old potter named Hiroshi. He had been making pottery for sixty years. His hands knew clay the way a musician's hands know their instrument.

One day, a wealthy merchant visited Hiroshi's workshop. He examined every pot, bowl, and vase. Then he pointed to a tea cup on the shelf — a simple cup with a crack running down one side, mended with gold.

"Why do you display a broken cup?" the merchant asked. "It is damaged. You should throw it away."

Hiroshi picked up the cup gently. "This is the most valuable piece in my shop."

The merchant laughed. "A cracked cup? More valuable than your perfect ones?"

Hiroshi poured tea into the cup and handed it to the merchant. "This cup belonged to my wife. She drank from it every morning for thirty years. When she passed away, I knocked it off the table in my grief. It shattered into pieces."

He traced the golden line with his finger. "I gathered every piece and mended it with gold, in our tradition of kintsugi. We believe that when something has been broken and repaired, it becomes more beautiful than before. The cracks are not something to hide — they are something to illuminate."

The merchant held the cup differently now, feeling its warmth, seeing the golden rivers of repair that caught the light.

"The crack is part of its history," Hiroshi said. "Just as our scars are part of ours. We are not broken by the hard things that happen to us. We are made more beautiful by how we heal."

The merchant left the shop that day without buying a single perfect pot. But he never forgot the cracked cup mended with gold.

Our wounds and imperfections are not things to be ashamed of. They are proof that we have lived, loved, and healed. They are the gold in our story.`,
      },
    ],
  },
  {
    id: "adventure",
    title: "Adventure",
    description: "Gentle adventures and discoveries",
    icon: "compass",
    colors: ["#fa709a", "#fee140"] as const,
    stories: [
      {
        id: "a1",
        title: "The Lighthouse Keeper's Discovery",
        summary: "An old lighthouse keeper finds something unexpected washed ashore.",
        readTime: "4 min",
        body: `Samuel had been the lighthouse keeper on Gull Island for thirty-seven years. Every evening, he climbed the one hundred and twelve steps to light the lamp. Every morning, he climbed down. In between, there was the sea, the wind, and silence.

He liked the silence. But sometimes, in the long winter nights, he wished for a bit of company.

One morning after a storm, Samuel walked along the beach to check for damage. Among the seaweed and driftwood, he found a glass bottle with a rolled-up paper inside.

His hands trembled as he pulled out the note. It read:

"My name is Elara. I am nine years old. I live in a fishing village across the sea. My grandmother says that messages in bottles can travel the whole world. I don't believe her, but I am trying anyway. If you find this, please write back. I want to know what the world looks like from where you are. Put your reply in a bottle and throw it in the sea."

Samuel laughed — a real, full laugh that echoed off the rocks. He hadn't laughed like that in years.

That afternoon, he sat at his desk and wrote:

"Dear Elara, my name is Samuel. I am seventy-one years old, and I live in a lighthouse on a tiny island. From my window, I can see the ocean stretch in every direction. In the mornings, the sea is silver. In the evenings, it is gold. Your grandmother was right — your message traveled far. And it made an old lighthouse keeper very happy."

He sealed the letter in a bottle and threw it into the sea.

Three months later, another bottle arrived. And then another. Over the next two years, Samuel and Elara exchanged dozens of letters. She told him about her village, her school, her cat named Biscuit. He told her about the whales that passed in winter, the stars that were brighter on his island than anywhere else, and the time a seal fell asleep on his doorstep.

One spring day, a small fishing boat appeared at his dock. A young girl with dark braids and bright eyes climbed out, followed by an elderly woman.

"Are you Samuel?" the girl asked.

He nodded, unable to speak.

"I'm Elara. And this is my grandmother. She wanted to meet the man who proved her right about bottles."

That afternoon, three people sat in a lighthouse kitchen, drinking tea and laughing. And the silence Samuel had loved for thirty-seven years finally had something even better mixed in: the sound of friendship.`,
      },
      {
        id: "a2",
        title: "The Map in the Attic",
        summary: "Two grandchildren find an old map in their grandfather's attic.",
        readTime: "4 min",
        body: `When ten-year-old twins Asha and Arjun visited their grandfather's old house during the summer holidays, they found it dusty, quiet, and — in their words — "extremely boring."

"There's nothing to do here!" Arjun complained.

Their grandfather, whom they called Thatha, smiled mysteriously. "Nothing to do? Have you checked the attic?"

The twins raced upstairs. The attic was full of old trunks, forgotten furniture, and cobwebs. But in a wooden chest, beneath a stack of yellowed newspapers, they found a hand-drawn map.

It showed the house, the garden, the old well, and the mango grove behind it. A dotted line wound through all of these, ending at an X marked "The Treasure."

"Thatha! There's a treasure map!" Asha shouted.

Their grandfather appeared at the attic door, trying to look surprised. "A treasure map? Well, you'd better follow it."

The first clue led to the old well, where they found a small tin box with a note: "I carved my initials here when I was your age. Can you find them?" The twins searched the well's stone rim and found the letters — R.K. — carved fifty years ago.

The second clue sent them to the mango grove, where they climbed the biggest tree and found a wooden box wedged in a branch. Inside was a photograph of their grandfather as a boy, standing in the same grove, grinning with two missing front teeth.

The third clue led them to the kitchen garden, where they dug near the jasmine bush and unearthed a small clay pot. Inside were glass marbles — the same marbles their grandfather had played with as a child.

The final clue brought them back to the house, to Thatha's reading chair. Taped under the seat cushion was an envelope marked "The Treasure."

Inside was a handwritten note:

"The treasure is not gold or jewels. The treasure is this house, this garden, these trees that your great-grandfather planted. The treasure is the stories these walls hold. And now the treasure is you — because you are the next chapter of this family's story."

The twins looked at each other, then at their grandfather.

"This is the best summer ever," Asha said quietly.

Thatha smiled. "There is never nothing to do. You just have to know where to look."`,
      },
      {
        id: "a3",
        title: "The Train to Nowhere",
        summary: "An old woman takes a train without a destination and finds exactly where she needs to be.",
        readTime: "4 min",
        body: `On the morning of her seventieth birthday, Mrs. Kamala did something she had never done before. She walked to the railway station, looked at the departure board, and bought a ticket for the next train — without checking where it was going.

"One ticket, please," she said.

"Where to?" asked the clerk.

"Wherever the next train goes."

The clerk raised his eyebrows but printed the ticket. The next train was going to a small town called Meenakshipuram — a place Mrs. Kamala had never heard of.

She boarded the train with nothing but her handbag and a sense of adventure she hadn't felt since she was twenty.

The train passed through rice paddies, over bridges, and alongside rivers. She watched the world go by from her window seat, eating vada from a vendor who walked through the compartment, and chatting with a college student who was traveling home.

When she arrived at Meenakshipuram, she had no plan. She walked out of the station and into the small town. There was a temple with a beautiful garden, a tea shop with wooden benches under a banyan tree, and a lake where children were feeding ducks.

She sat at the tea shop and ordered a cup of filter coffee. The owner, an old man named Mani, asked where she was from.

"The city," she said. "I took a train without knowing where it would take me."

Mani laughed. "That is the best way to travel! You always end up where you're supposed to be."

They talked for hours. Mani told her about the temple festival next week, the best sunset spot by the lake, and how his grandmother had started this tea shop sixty years ago.

Mrs. Kamala stayed for three days. She visited the temple, walked around the lake every morning, ate fresh idlis at Mani's shop, and watched the most beautiful sunset of her life from a hilltop she had never known existed.

On the train home, she wrote in a small notebook:

"For seventy years, I always knew where I was going. Today I learned that sometimes the best journey is the one you don't plan. The world is full of beautiful places you'll never see if you only go where you intended."

She smiled, looked out the window, and started planning her next unplanned trip.`,
      },
    ],
  },
  {
    id: "kindness",
    title: "Kindness",
    description: "Stories of compassion and care",
    icon: "heart",
    colors: ["#ff6b9d", "#c06c84"] as const,
    stories: [
      {
        id: "k1",
        title: "The Warm Coat",
        summary: "A simple act of kindness on a cold winter night changes two lives.",
        readTime: "3 min",
        body: `It was the coldest night of the year when old Mr. Krishnan locked up his tailoring shop and began his walk home. The streets were empty, the wind was bitter, and his warm wool coat kept him comfortable.

As he passed the bus stop, he saw a young man sitting on the bench — thin, shivering, wearing nothing but a cotton shirt. The young man was holding a small bag and staring at the ground.

Mr. Krishnan walked past. Then he stopped. Then he turned around.

"Son, where is your coat?" he asked.

The young man looked up. "I don't have one, uncle. I just arrived from my village for a job interview tomorrow morning. I spent all my money on the bus ticket."

Mr. Krishnan looked at the young man's thin shirt, then at his own thick wool coat. He had had this coat for fifteen years. His wife had chosen the fabric. He had stitched it himself. It was his favorite possession.

He took off the coat and held it out to the young man.

"Uncle, I can't take your coat—"

"You have a job interview tomorrow," Mr. Krishnan said firmly. "You cannot go shivering. Take it. Return it to my shop when you get your first paycheck."

The young man's eyes filled with tears. He put on the coat.

Mr. Krishnan walked home in the cold that night. His wife scolded him when he arrived, shivering. But he slept well, better than he had in a long time.

Three weeks later, the young man walked into the tailoring shop wearing a new shirt and a big smile. He had gotten the job.

He returned the coat, along with a box of sweets. But he also brought something else — his first month's salary.

"I want you to make a new coat, uncle," he said. "Not for me. For the next person who needs one."

Mr. Krishnan made the coat. And he hung it on a hook by his shop door with a small sign: "If you need warmth, take this coat. No questions asked."

Over the years, that coat was taken and returned dozens of times. Sometimes it came back with a thank-you note. Sometimes it came back with money for another coat.

One coat became five. Five became twenty. What started on one cold night became a tradition that warmed the entire neighborhood for years.

Kindness is the only thing that multiplies when you give it away.`,
      },
      {
        id: "k2",
        title: "The Lunch Box",
        summary: "A school canteen worker notices what no one else does.",
        readTime: "3 min",
        body: `Mrs. Janaki had worked in the school canteen for twenty years. She knew every child's favorite food. She knew who liked extra sambar and who wanted their rice plain. But most of all, she noticed things.

She noticed that Ravi, a quiet boy in the fifth grade, never bought lunch. While other children lined up at the counter, Ravi sat alone at his desk, pretending to read a book. He never complained. He never asked for anything.

One day, Mrs. Janaki packed an extra lunch box. She walked to Ravi's classroom during lunch break and placed it on his desk.

"Someone ordered this but didn't pick it up," she said casually. "It would be a waste to throw it away. Would you help me by eating it?"

Ravi looked at the lunch box — rice, dal, vegetables, and a small piece of pickle — and then at Mrs. Janaki. He understood what she was doing. But she had given him a way to accept it without feeling ashamed.

"Thank you, aunty," he said quietly.

The next day, there was another "unclaimed" lunch box on his desk. And the day after that. Mrs. Janaki never made a fuss. She never told anyone. She never made Ravi feel like a charity case.

This went on for three years, until Ravi finished school.

Fifteen years later, a well-dressed man walked into the school canteen. Mrs. Janaki was older now, her hair grey, her steps slower, but she was still there — still noticing things.

The man walked up to her. "Aunty, do you remember me?"

She looked at him closely. "Ravi?"

He nodded. He was an engineer now, working in the city. He had come back to the school for one reason.

He handed her an envelope. Inside was enough money to fund free lunches for underprivileged students for an entire year.

"You fed me when no one was watching," he said. "You did it so quietly that I could keep my dignity. That meant more to me than the food."

Mrs. Janaki wiped her eyes with the edge of her sari.

The truest kindness is the kind that no one sees — the kind that protects someone's dignity while filling their need. It doesn't ask for credit. It doesn't need an audience. It simply does what is right, quietly and with love.`,
      },
      {
        id: "k3",
        title: "The Stranger's Umbrella",
        summary: "A forgotten umbrella connects two strangers across years.",
        readTime: "3 min",
        body: `Dr. Meena was running late for her train when the rain started — sudden, heavy, the kind of rain that soaks you in seconds. She had no umbrella.

As she stood under a shop awning, trying to figure out what to do, an elderly man she had never met stepped beside her and held his umbrella over both of them.

"Shall we walk to the station together?" he asked simply.

They walked in the rain, sharing the umbrella, saying nothing much — just two strangers heading the same way. At the station, Dr. Meena thanked him and reached for her purse.

"Please, how much for the umbrella—"

"Keep it," the old man said. "I have another one at home. Just do me one favor. The next time you see someone caught in the rain, share it."

Dr. Meena took the train, holding the umbrella — a simple black one, nothing special. But she kept it in her bag from that day forward.

Over the next ten years, she shared that umbrella more times than she could count. She shared it with a mother carrying a baby outside a hospital. She shared it with a student rushing to an exam. She shared it with a street vendor trying to protect his cart of fruits.

Each time, she said the same thing: "Someone shared this with me once. I'm just passing it along."

One rainy evening, years later, Dr. Meena was leaving the hospital after a long shift when she saw a young girl — maybe six or seven — standing outside with no umbrella, waiting for someone who hadn't come yet.

Dr. Meena walked over and held the umbrella over the little girl. The girl's mother arrived a few minutes later, apologizing for being late.

"Thank you so much," the mother said. "Can I return the umbrella?"

Dr. Meena shook her head. "Keep it. And the next time you see someone caught in the rain, share it."

The mother smiled and took the umbrella.

Dr. Meena walked to her car in the rain, getting thoroughly soaked. But she was smiling.

The umbrella was gone, but what it carried — that small act of kindness from a stranger at a bus stop ten years ago — was still traveling, still sheltering people, still moving through the world.

One small kindness, passed from hand to hand, can shelter more people than you will ever know.`,
      },
    ],
  },
]

// View modes: "themes" -> "storyList" -> "reading"
type ViewMode = "themes" | "storyList" | "reading"

export default function StorytellingScreen() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>("themes")
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme | null>(null)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  const goBack = () => {
    if (viewMode === "reading") {
      setViewMode("storyList")
      setSelectedStory(null)
    } else if (viewMode === "storyList") {
      setViewMode("themes")
      setSelectedTheme(null)
    } else {
      router.back()
    }
  }

  // Reading view
  if (viewMode === "reading" && selectedStory && selectedTheme) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={selectedTheme.colors}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={goBack}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {selectedStory.title}
            </Text>
            <View style={{ width: 28 }} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.storyContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.storyCard}>
            <Ionicons
              name="book-outline"
              size={40}
              color="#667eea"
              style={styles.storyIcon}
            />
            <Text style={styles.storyTitleText}>{selectedStory.title}</Text>
            <Text style={styles.storyReadTime}>{selectedStory.readTime} read</Text>
            <View style={styles.storyDivider} />
            <Text style={styles.storyText}>{selectedStory.body}</Text>
          </View>

          <TouchableOpacity
            style={styles.newStoryButton}
            onPress={goBack}
          >
            <LinearGradient
              colors={selectedTheme.colors}
              style={styles.buttonGradient}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.newStoryButtonText}>More Stories</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    )
  }

  // Story list view
  if (viewMode === "storyList" && selectedTheme) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={selectedTheme.colors}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={goBack}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedTheme.title} Stories</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.headerInfo}>
            <Ionicons name={selectedTheme.icon} size={50} color="#fff" />
            <Text style={styles.headerDescription}>
              {selectedTheme.description}
            </Text>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {selectedTheme.stories.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyListCard}
              onPress={() => {
                setSelectedStory(story)
                setViewMode("reading")
              }}
            >
              <View style={styles.storyListContent}>
                <Ionicons name="book" size={28} color="#667eea" />
                <View style={styles.storyListText}>
                  <Text style={styles.storyListTitle}>{story.title}</Text>
                  <Text style={styles.storyListSummary}>{story.summary}</Text>
                  <Text style={styles.storyListReadTime}>{story.readTime} read</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    )
  }

  // Theme selection view
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Story Time</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.headerInfo}>
          <Ionicons name="book" size={60} color="#fff" />
          <Text style={styles.headerDescription}>
            Enjoy heartwarming stories to brighten your day
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Choose a Theme</Text>

        <View style={styles.themesGrid}>
          {STORY_THEMES.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={styles.themeCard}
              onPress={() => {
                setSelectedTheme(theme)
                setViewMode("storyList")
              }}
            >
              <LinearGradient
                colors={theme.colors}
                style={styles.themeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={theme.icon} size={40} color="#fff" />
                <Text style={styles.themeTitle}>{theme.title}</Text>
                <Text style={styles.themeDescription}>
                  {theme.description}
                </Text>
                <Text style={styles.themeCount}>
                  {theme.stories.length} stories
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  headerInfo: {
    alignItems: "center",
  },
  headerDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 15,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  themesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  themeCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  themeGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 160,
    justifyContent: "center",
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    textAlign: "center",
  },
  themeDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
    textAlign: "center",
  },
  themeCount: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 8,
    fontWeight: "600",
  },
  // Story list styles
  storyListCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  storyListContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  storyListText: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  storyListTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  storyListSummary: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
  },
  storyListReadTime: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "600",
    marginTop: 6,
  },
  // Story reading styles
  storyContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  storyCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storyIcon: {
    alignSelf: "center",
    marginBottom: 15,
  },
  storyTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  storyReadTime: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 15,
  },
  storyDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  storyText: {
    fontSize: 17,
    lineHeight: 28,
    color: "#333",
  },
  newStoryButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  newStoryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
})


