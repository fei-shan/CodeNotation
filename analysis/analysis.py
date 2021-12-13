import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import pandas as pd
import numpy as np
import plotly.graph_objects as go


def plotly_plot(data):
    question1 = data.loc[data['Q1'] == 'Question 1']
    question2 = data.loc[data['Q1'] == 'Question 2']
    l1 = len(question1)
    l2 = len(question2)
    print(l1, l2)

    columns = [
               'Q2',  # Usability
               'Q3', 'Q4', 'Q5', 'Q6', 'Q7',  # Annotation
               'Q8',  # Prefer audio
               'Q10', 'Q11'  # Timer
               ]
    top_labels = ['Strongly agree', 'Agree', 'Neutral', 'Disagree',
                  'Strongly disagree']
    colors = ['rgba(38, 24, 74, 0.8)', 'rgba(71, 58, 131, 0.8)',
              'rgba(122, 120, 168, 0.8)', 'rgba(164, 163, 204, 0.85)',
              'rgba(190, 192, 213, 1)']
    y_data = [
              'Easy to use',
              'Easy to<br>understand',
              'Reflect most<br>thoughts',
              'Helps solving<br>problem',
              'Gain awareness<br>of thoughts',
              'Create cognitive<br>burden',
              'Prefer audio<br>recording',
              'Countdown timer<br>disrupted coding',
              'Countdown timer<br>disrupted thoughts'
              ]
    x1 = []
    x2 = []
    for c in columns:
        x1.append(question1[c].value_counts(
            # normalize=True
        ).sort_index())
        x2.append(question2[c].value_counts(
            # normalize=True
        ).sort_index())
    x1_df = pd.concat(x1, axis=1).fillna(0)
    x2_df = pd.concat(x2, axis=1).fillna(0)
    x1_data = [x1_df[c] for c in columns]
    x2_data = [x2_df[c] for c in columns]

    def show(x_data, count, title_str):
        fig = go.Figure()
        for i in range(0, len(x_data[0])):
            legend = True
            for xd, yd in zip(reversed(x_data), reversed(y_data)):
                fig.add_trace(go.Bar(
                    name=top_labels[i],
                    x=[xd.iloc[i]], y=[yd],
                    orientation='h',
                    marker=dict(
                        color=colors[i],
                        line=dict(color='rgb(248, 248, 249)', width=1)
                    ),
                    width=0.5,
                    showlegend=legend
                ))
                legend = False

        fig.update_layout(
            xaxis=dict(
                showgrid=False,
                showline=False,
                showticklabels=False,
                zeroline=False,
                domain=[0.15, 1]
            ),
            yaxis=dict(
                showgrid=False,
                showline=False,
                showticklabels=False,
                zeroline=False,
            ),
            barmode='stack',
            paper_bgcolor='rgb(248, 248, 255)',
            plot_bgcolor='rgb(248, 248, 255)',
            margin=dict(l=120, r=10, t=140, b=80),
            # showlegend=False,
        )

        annotations = []

        for yd, xd in zip(y_data, x_data):
            # labeling the y-axis
            annotations.append(dict(xref='paper', yref='y',
                                    x=0.14, y=yd,
                                    xanchor='right',
                                    text=str(yd),
                                    font=dict(family='Arial', size=14,
                                              color='rgb(67, 67, 67)'),
                                    showarrow=False, align='right'))
            # labeling the first percentage of each bar (x_axis)
            if xd.iloc[0] != 0:
                annotations.append(dict(xref='x', yref='y',
                                        x=xd.iloc[0] / 2, y=yd,
                                        text=str(int(xd.iloc[0] / count * 100)) + '%',
                                        font=dict(family='Arial', size=14,
                                                  color='rgb(248, 248, 255)'),
                                        showarrow=False))
            # # labeling the first Likert scale (on the top)
            # if yd == y_data[-1]:
            #     annotations.append(dict(xref='x', yref='paper',
            #                             x=xd.iloc[0]/2, y=1.1,
            #                             text=top_labels[0],
            #                             font=dict(family='Arial', size=14,
            #                                       color='rgb(67, 67, 67)'),
            #                             showarrow=False))
            space = xd.iloc[0]
            for i in range(1, len(xd)):
                # labeling the rest of percentages for each bar (x_axis)
                if xd.iloc[i] == 0:  # skip 0
                    continue
                annotations.append(dict(xref='x', yref='y',
                                        x=space + (xd.iloc[i] / 2), y=yd,
                                        text=str(int(xd.iloc[i] / count * 100)) + '%',
                                        font=dict(family='Arial', size=14,
                                                  color='rgb(248, 248, 255)'),
                                        showarrow=False))
                # # labeling the Likert scale
                # if yd == y_data[-1]:
                #     annotations.append(dict(xref='x', yref='paper',
                #                             x=space + (xd.iloc[i] / 2), y=1.1,
                #                             text=top_labels[i],
                #                             font=dict(family='Arial', size=14,
                #                                       color='rgb(67, 67, 67)'),
                #                             showarrow=False))
                space += xd.iloc[i]
        legend = {
            'orientation': 'h',
            'x': 0.2,
            'y': 0,
        }
        title = {
            'text': title_str,
            'y': 0.81,
            'x': 0.1,
            # 'xanchor': 'left',
            # 'yanchor': 'bottom'
        }
        fig.update_layout(title=title,
                          annotations=annotations,
                          legend=legend,
                          paper_bgcolor='rgba(0,0,0,0)',
                          plot_bgcolor='rgba(0,0,0,0)',
                          legend_traceorder='normal')
        fig.show()

    show(x1_data, l1, 'Fibonacci Sequence')
    show(x2_data, l2, 'Count Capital Consonants')


def matplotlib_plot(data):
    plt.close('all')
    fig = plt.figure(figsize=[10.24, 7.68])
    gs1 = gridspec.GridSpec(7, 1)
    ax1 = fig.add_subplot(gs1[0:2])
    ax2 = fig.add_subplot(gs1[2:5])
    ax3 = fig.add_subplot(gs1[5:7])

    ax1.set_title('Overall Usability')
    ax1.set_xlim([5.5, 0.5])
    ax1.set_xticks([5, 4, 3, 2, 1])
    ax1.set_xticklabels(['Strongly disagree', '', 'Neural', '', 'Strongly agree'])

    ax1.boxplot([data['Q3'], data['Q2']],
                labels=['Easy to understand \nannotation',
                        'Easy to use \napplication'],
                # showfliers=False,
                # autorange=True,
                widths=0.33,
                vert=False)

    ax2.set_title('Annotation')
    ax2.set_xlim([5.5, 0.5])
    ax2.set_xticks([5, 4, 3, 2, 1])
    ax2.set_xticklabels(['Strongly disagree', '', 'Neural', '', 'Strongly agree'])

    ax2.boxplot([data['Q8'], data['Q7'], data['Q6'], data['Q5'], data['Q4']],
                labels=['"Prefer audio \nrecording"',
                        '"Introduce \ncognitive burden"',
                        '"Improve awareness \nof thoughts"',
                        '"Helped solving \nthe problem"',
                        '"Reflect most \nthoughts"'],
                # showfliers=False,
                # autorange=True,
                widths=0.5,
                vert=False)

    ax3.set_title('Countdown Timer')
    ax3.set_xlim([5.5, 0.5])
    ax3.set_xticks([5, 4, 3, 2, 1])
    ax3.set_xticklabels(['Strongly disagree', '', 'Neural', '', 'Strongly agree'])

    ax3.boxplot([data['Q11'], data['Q10']],
                labels=['"Disrupt \nthoughts"',
                        '"Disrupt \nprogramming"'],
                # showfliers=False,
                # autorange=True,
                widths=0.33,
                vert=False)

    gs1.tight_layout(fig)
    plt.savefig('usability')


def main():
    # Load data
    data = pd.read_csv('data.csv')
    # data['Q1'] = data['Q1'].map(lambda x: x.lstrip('Question '))
    print(len(data[data['Q9'] == 'Too short']))

    # matplotlib_plot(data)
    plotly_plot(data)


if __name__ == '__main__':
    main()
