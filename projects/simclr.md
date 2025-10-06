Context:
I wanted to understand how self-supervised learning works at a fundamental level, so I implemented SimCLR from scratch on the HAM10000 skin disease dataset. Instead of using ready-made libraries, I experimented step by step, fixing bugs and visualizing the process.

Start Point:

Goal: apply SimCLR (Chen et al., 2020) on the HAM10000 skin lesion dataset to test self-supervised learning for medical images.

Tools: PyTorch, ResNet backbone, HAM10000 dataset (10k dermatoscopic images).

Trial & Error Path:

At first I am bit greedy with my limitations os I decided to train it res50 with 224 image size, of course google colab limlits hit. 
I played with some more image sizes and batch sizes. Then I relized I may need more computational power. so I moved back to resnet 18 and 128 image size. 

