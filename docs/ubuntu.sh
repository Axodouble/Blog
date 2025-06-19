#!/bin/bash

# curl -fsSL https://u.cer.sh/install.sh | sh

# Install script for Axo's Ubuntu utils

# Add external repositories
sudo add-apt-repository ppa:tomtomtom/yt-dlp

# Install packages
sudo apt update
sudo apt upgrade -y
sudo apt install -y \
    curl \
    net-tools \
    htop \
    btop \
    git \
    gh \
    gcc \
    unzip

# Install yt-dlp
sudo apt install -y yt-dlp

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Install Brew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add yt-dlp alias to .bashrc if not already present
ALIAS_CMD="alias d=\"yt-dlp -o '~/Memes/%(title)s.%(ext)s'\""
if ! grep -Fxq "$ALIAS_CMD" ~/.bashrc; then
    echo "$ALIAS_CMD" >> ~/.bashrc
fi

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add user to docker group
sudo usermod -aG docker $USER
