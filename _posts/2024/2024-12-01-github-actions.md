---
title: Github Actions 传递信息
description: github actions 在作业之间传递信息
categories: [github]
category: github
tags: [github]
image:
  path: commons/github-mark.png
  lqip: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAklEQVR4AewaftIAAADqSURBVGXBvytEcQAA8M/7nm7WO8cx3w2P4S2K0v0PRpmUslzZL5O/QP4BWZluUWYZGOTeoEc9MrqSbvT7vGIgn0/kRzNJx7GGBd/OsV/k2VApUmom6SJ6mPLXAMtFnp1FzSSdxBUOERBjhCFesIq5MXQwgZMizw780kzSZWyiE9DGG1HPf0d4RjugimA0qvgvIKAacIlIZKs1mwY/Wkka0EUVl5W43rjHEh6wHdem98YnG1HEBVbwivVQ5FmOXcxgp7jpf9zl/U+84x0bRZ7lFaWnx0EW1xu3mH96HJwqxfVGzUi3uM6Olb4AqAhGYAJ03c0AAAAASUVORK5CYII=
---



```yaml
{% raw %}
name: Github Actions 在作业之间传递信息
on:
  workflow_dispatch:
    inputs:
      version:
        description: '输入发布的tag版本(例如：1.0.0)'
        required: true
        type: string
      notify:
        description: '钉钉通知webhook'
        required: true
        type: choice
        options:
          - 个人通知
          - 开发群通知
          
env:
  tag_version: v${{ inputs.version }}
jobs:
  windows-job:
    name: windows job
    runs-on: windows-latest
    outputs:
      output1: ${{ steps.step1.outputs.MY_OUTPUT_VAR }}
    steps:
      - name: 设置环境变量-windows
        shell: pwsh
        run: |
          echo "::debug::Set the Octocat variable"
          Write-Output "::debug::Set the Octocat variable"
          $value="环境变量值-windows"
          echo "MY_ENV_VAR=${value}" >> $env:GITHUB_ENV
          # 添加摘要
          "### 设置环境变量 SUCCESS! :rocket:" >> $env:GITHUB_STEP_SUMMARY
      - name: 使用环境变量-windows
        run: |
          echo "The value of MY_ENV_VAR is $env:MY_ENV_VAR"
          # echo "The value of MY_ENV_VAR is ${{ env.MY_ENV_VAR }}"
      - name: 设置作业输出参数-windows
        shell: pwsh
        id: step1
        run: |
            $value="输出参数值-windows"
            echo "MY_OUTPUT_VAR=${value}" >> $env:GITHUB_OUTPUT
      - name: 使用作业输出参数-windows
        shell: pwsh
        run: |
          # echo "The value of MY_OUTPUT_VAR is ${{ steps.step1.outputs.MY_OUTPUT_VAR }}"
  ubuntu-job:
    needs: [windows-job]
    name: ubuntu job
    runs-on: ubuntu-latest
    steps:
      - name: windows-job 参数
        env:
          wj_output1: ${{ needs.windows-job.outputs.output1 }}
        run: |
          echo $wj_output1
          echo "${{ needs.windows-job.outputs.output1 }}"
          echo '${{ toJSON(needs.windows-job.outputs)  }}'
      - name: 设置环境变量-ubuntu
        run: |
          value='环境变量-windows'
          echo $value
          echo "MY_ENV_VAR=$value" >> $GITHUB_ENV
          echo "### 设置环境变量 SUCCESS! :rocket:" >> $GITHUB_STEP_SUMMARY
      - name: 使用环境变量-ubuntu
        run: |
          echo "The value of MY_ENV_VAR is ${{ env.MY_ENV_VAR }}"
          echo "The value of MY_ENV_VAR is $MY_ENV_VAR"
      - name: 设置作业输出参数-ubuntu
        id: step1
        run: |
            value='输出参数值-windows'
            echo "MY_OUTPUT_VAR=$value" >> $GITHUB_OUTPUT
      - name: 使用作业输出参数-ubuntu
        shell: pwsh
        run: |
          echo "The value of MY_OUTPUT_VAR is ${{ steps.step1.outputs.MY_OUTPUT_VAR }}"
{% endraw %}
      
```
