#!/bin/bash

# curl -fsSL https://axodouble.com/ubuntu.sh | sh

# Install script for Axo's Ubuntu utils

# Add external repositories
sudo add-apt-repository ppa:tomtomtom/yt-dlp

# Install packages
sudo apt update
sudo apt upgrade -y
sudo apt install -y \
  distrobox \
  neofetch \
  curl \
  net-tools \
  htop \
  btop \
  git \
  gh \
  gcc \
  unzip \
  make \
  build-essential \
  golang \
  flatpak \
  gnome-software-plugin-flatpak

# Install python build essentials
sudo apt install -y libssl-dev zlib1g-dev \
  libbz2-dev libreadline-dev libsqlite3-dev \
  libncursesw5-dev xz-utils tk-dev libxml2-dev \
  libxmlsec1-dev libffi-dev liblzma-dev

# Install Bun
if ! command -v bun &>/dev/null; then
  curl -fsSL https://bun.sh/install | bash
fi

# Install yt-dlp
sudo apt install -y yt-dlp

# Add yt-dlp alias to .bashrc if not already present
ALIAS_CMD="alias d=\"yt-dlp -o '~/Memes/%(title)s.%(ext)s'\""
if ! grep -Fxq "$ALIAS_CMD" ~/.bashrc; then
  echo "$ALIAS_CMD" >>~/.bashrc
fi

# Install Node Version Manager
if ! command -v nvm &>/dev/null; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/refs/heads/master/install.sh | bash
fi

# Install Pyenv if not already installed
if ! command -v pyenv &>/dev/null; then
  curl https://pyenv.run | bash
fi

PYENV_ROOT='export PYENV_ROOT="$HOME/.pyenv"'
PYENV_PATH='[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"'
PYENV_INIT='eval "$(pyenv init - bash)"'

if ! grep -Fxq "$PYENV_ROOT" ~/.bashrc; then
  echo "$PYENV_ROOT" >>~/.bashrc
fi
if ! grep -Fxq "$PYENV_PATH" ~/.bashrc; then
  echo "$PYENV_PATH" >>~/.bashrc
fi
if ! grep -Fxq "$PYENV_INIT" ~/.bashrc; then
  echo "$PYENV_INIT" >>~/.bashrc
fi
if ! grep -Fxq "$PYENV_ROOT" ~/.profile; then
  echo "$PYENV_ROOT" >>~/.profile
fi
if ! grep -Fxq "$PYENV_PATH" ~/.profile; then
  echo "$PYENV_PATH" >>~/.profile
fi
if ! grep -Fxq "$PYENV_INIT" ~/.profile; then
  echo "$PYENV_INIT" >>~/.profile
fi

# Install Tailscale if not already installed
if ! command -v tailscale &>/dev/null; then
  curl -fsSL https://tailscale.com/install.sh | sh
fi

# Install Brew if not already installed
if ! command -v brew &>/dev/null; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  BREW='eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"'

  if ! grep -Fxq "$BREW" ~/.bashrc; then
    echo "$BREW" >>~/.bashrc
  fi
  if ! grep -Fxq "$BREW" ~/.profile; then
    echo "$BREW" >>~/.profile
  fi

  eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi

# Install Docker if not already installed
if ! command -v docker &>/dev/null && ! which docker &>/dev/null && ! [ -x "/usr/bin/docker" ]; then
  echo "Docker not found, installing..."
  curl -fsSL https://get.docker.com | sudo sh

  # Add user to docker group
  sudo usermod -aG docker $USER
  echo "Docker installation completed."
else
  echo "Docker is already installed, skipping installation."
fi

# Install gobonsai
curl -fsSL https://raw.githubusercontent.com/Axodouble/gobonsai/refs/heads/master/install.sh | bash

# Add Flathub to Flatpak
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

brew install lazydocker lazygit

git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
sudo snap install nvim --classic
